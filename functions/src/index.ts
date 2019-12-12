import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Transacao, CaixaFinanceiro } from '../../src/app/interfaces';
import { format } from 'date-fns';

admin.initializeApp();

const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

const controleExecucao = funcao => firestore.collection('controleExecucao').doc(funcao);

export const recalcularSaldoTotal = functions.https.onCall(async (_, ctx) => {
  const uid = ctx.auth && ctx.auth.uid;

  if (!uid) {
    return false;
  }

  const controle = controleExecucao(`recalcularSaldo${uid}`);

  try {
    if (uid && (await controle.create({}).catch(() => false))) {
      const dataAtual = format(new Date(), 'yyyy-MM-dd');

      const caixas = await firestore
        .collection(`usuarios/${uid}/caixasFinanceiros`)
        .get()
        .then(q => q.docs);

      for (const caixa of caixas) {
        const transacoes = await firestore
          .collection(`usuarios/${uid}/transacoes`)
          .where('caixaFinanceiro', '==', caixa.id)
          .get()
          .then(q => q.docs);

        let [saldoAtual, saldoFuturo] = [0, 0];

        for (const doc of transacoes) {
          const transacao = doc.data() as Transacao;

          const operacao = transacao.tipo === 'Receita' ? 1 : -1;

          if (transacao.dataTransacao > dataAtual) {
            saldoFuturo += transacao.valor * operacao;
          } else {
            saldoAtual += transacao.valor * operacao;

            if (transacao.caixaFuturo) {
              const tr = { caixaFuturo: false, caixaAtualizado: true } as Partial<Transacao>;
              await doc.ref.update(tr);
            }
          }
        }

        const dataAtualizacao = admin.firestore.Timestamp.now();
        const cx = { saldoAtual, saldoFuturo, dataAtualizacao } as Partial<CaixaFinanceiro>;
        await caixa.ref.update(cx);
      }
    }

    await controle.delete().catch(() => false);

    return true;
  } catch (e) {
    await controle.delete().catch(() => false);
    throw e;
  }
});

export const recalcularSaldoParcial = functions.https.onCall(async (_, ctx) => {
  const uid = ctx.auth && ctx.auth.uid;

  if (!uid) {
    return false;
  }

  const controle = controleExecucao(`usuarioOnWrite${uid}`);

  if (await controle.create({}).catch(() => false)) {
    const query = await firestore
      .collection(`usuarios/${uid}/transacoes`)
      .where('dataTransacao', '<=', format(new Date(), 'yyyy-MM-dd'))
      .where('caixaFuturo', '==', true)
      .get();

    for (const doc of query.docs) {
      await excluirTransacaoCaixaFinanceiro(uid, doc);
      await inserirTransacaoCaixaFinanceiro(uid, doc);
    }

    await controle.delete().catch(() => false);
  }

  return true;
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

    if (dataTransacao > data || (transacao.caixaFuturo && !insert)) {
      updateCaixa.saldoFuturo = (saldoFuturo || 0) + valor * operacao;
    } else {
      updateCaixa.saldoAtual = (saldoAtual || 0) + valor * operacao;
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
    const data = format(dia ? new Date().setDate(dia) : new Date(), 'yyyy-MM-dd');
    return { doc, caixa, data };
  } else {
    return {};
  }
}
