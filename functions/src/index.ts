import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Transacao, CaixaFinanceiro } from '../../src/app/interfaces';
import { format } from 'date-fns';

admin.initializeApp();

const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

export const usuarioOnWrite = functions.firestore
  .document('usuarios/{id}')
  .onWrite(async (_, ctx) => {
    const query = await firestore
      .collection(`usuarios/${ctx.params.id}/transacoes`)
      .where('dataTransacao', '<=', format(new Date(), 'YYYY-MM-DD'))
      .where('caixaFuturo', '==', true)
      .get();

    for (const doc of query.docs) {
      await excluirTransacaoCaixaFinanceiro(ctx.params.id, doc);
      await inserirTransacaoCaixaFinanceiro(ctx.params.id, doc);
    }

    console.log(`${query.size} transações atualizadas!`);
  });

export const transacaoOnCreate = functions.firestore
  .document('usuarios/{id}/transacoes/{transacaoId}')
  .onCreate(async (doc, ctx) => {
    await inserirTransacaoCaixaFinanceiro(ctx.params.id, doc);
  });

export const transacaoOnUpdate = functions.firestore
  .document('usuarios/{id}/transacoes/{transacaoId}')
  .onUpdate(async (doc, ctx) => {
    if (!(doc.after.data() as Transacao).caixaAtualizado) {
      await excluirTransacaoCaixaFinanceiro(ctx.params.id, doc.before);
      await inserirTransacaoCaixaFinanceiro(ctx.params.id, doc.after);
    }
  });

export const transacaoOnDelete = functions.firestore
  .document('usuarios/{id}/transacoes/{transacaoId}')
  .onDelete(async (doc, ctx) => {
    await excluirTransacaoCaixaFinanceiro(ctx.params.id, doc);
  });

export const caixaFinanceiroOnDelete = functions.firestore
  .document('usuarios/{id}/caixasFinanceiros/{caixaId}')
  .onDelete(async (_, ctx) => {
    const query = await firestore
      .collection(`usuarios/${ctx.params.id}/transacoes`)
      .where('caixaFinanceiro', '==', ctx.params.caixaId)
      .get();

    for (const doc of query.docs) {
      await doc.ref.delete();
    }

    console.log(`${query.size} transações excluidas!`);
  });

async function inserirTransacaoCaixaFinanceiro(
  usuario: string,
  doc: admin.firestore.DocumentSnapshot
) {
  const transacao = doc.data() as Transacao;
  const atual = await atualizarTransacaoCaixaFinanceiro(usuario, transacao, true);
  await doc.ref.update({ caixaAtualizado: true, caixaFuturo: !atual } as Partial<Transacao>);
}

async function excluirTransacaoCaixaFinanceiro(
  usuario: string,
  doc: admin.firestore.DocumentSnapshot
) {
  const transacao = doc.data() as Transacao;
  await atualizarTransacaoCaixaFinanceiro(usuario, transacao, false);
}

async function atualizarTransacaoCaixaFinanceiro(
  usuario: string,
  transacao: Transacao,
  insert: boolean
) {
  const { doc, caixa, data } = await obterCaixaFinanceiro(usuario, transacao.caixaFinanceiro);

  if (doc && caixa) {
    const { dataTransacao, valor, tipo } = transacao;
    const { saldoAtual, saldoFuturo } = caixa;
    const operacao = (tipo === 'Receita' ? 1 : -1) * (insert ? 1 : -1);

    const updateCaixa: Partial<CaixaFinanceiro> = {};

    if (dataTransacao <= data) {
      updateCaixa.saldoAtual = (saldoAtual || 0) + valor * operacao;
    } else {
      updateCaixa.saldoFuturo = (saldoFuturo || 0) + valor * operacao;
    }

    console.log(updateCaixa, { saldoAtual, saldoFuturo }, valor, operacao);

    updateCaixa.dataAtualizacao = admin.firestore.FieldValue.serverTimestamp() as any;

    await doc.ref.update(updateCaixa);

    return dataTransacao <= data;
  } else {
    return false;
  }
}

async function obterCaixaFinanceiro(usuarioId: string, caixaId: string) {
  const doc = await firestore.doc(`usuarios/${usuarioId}/caixasFinanceiros/${caixaId}`).get();

  if (doc.exists) {
    const caixa = doc.data() as CaixaFinanceiro;
    const dia = caixa.diaFechamentoFatura;
    const data = format(dia ? new Date().setDate(dia) : new Date(), 'YYYY-MM-DD');
    return { doc, caixa, data };
  } else {
    return {};
  }
}
