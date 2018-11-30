import { Injectable } from '@angular/core';
import { TIPO_TRANSACAO, Transacao, Transferencia } from '../interfaces';
import { FirebaseService } from './firebase.service';
import { FormatarDadosService } from './formatar-dados.service';
import { first, switchMap } from 'rxjs/operators';
import { QueryFn } from '@angular/fire/firestore';

export const TIPOS_TRANSACAO: TIPO_TRANSACAO[] = ['Receita', 'Despesa'];

export const FILTRO_TODOS_CAIXAS = 'todos';

export const CAIXA_FILTRO_FN = caixa => (caixa !== FILTRO_TODOS_CAIXAS ? caixa : '');

export const PAGINACAO = 20;

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {
  constructor(private firebase: FirebaseService, private formatarDados: FormatarDadosService) {}

  async salvar(dados: Partial<Transacao>) {
    dados = {
      ...dados,
      id: dados.id || this.firebase.gerarNovoId(),
      descricao: this.formatarDados.capitalizar(dados.descricao),
      valor: this.formatarDados.valorToNumber(dados.valor),
      dataCadastro: dados.dataCadastro || this.firebase.serverTimestamp(),
      caixaAtualizado: false,
      caixaFuturo: false
    };

    return this.obterColecao()
      .pipe(first())
      .pipe(switchMap(c => this.firebase.operacao('salvar', c.doc(dados.id), dados)))
      .toPromise();
  }

  async salvarTransferencia(dados: Transferencia) {
    await this.salvar({
      id: this.firebase.gerarNovoId(),
      dataCadastro: this.firebase.serverTimestamp(),
      caixaFinanceiro: dados.caixaOrigem,
      tipo: 'Despesa',
      descricao: dados.descricao,
      valor: dados.valor,
      dataTransacao: dados.dataTransacao
    });

    await this.salvar({
      id: this.firebase.gerarNovoId(),
      dataCadastro: this.firebase.serverTimestamp(),
      caixaFinanceiro: dados.caixaDestino,
      tipo: 'Receita',
      descricao: dados.descricao,
      valor: dados.valor,
      dataTransacao: dados.dataTransacao
    });
  }

  excluir(id: string) {
    return this.obterColecao()
      .pipe(first())
      .pipe(switchMap(c => this.firebase.operacao('excluir', c.doc(id))))
      .toPromise();
  }

  obterTransacao(id: string) {
    return this.obterColecao().pipe(switchMap(c => c.doc(id).valueChanges()));
  }

  obterTodos(caixa = FILTRO_TODOS_CAIXAS, limite = PAGINACAO) {
    const filtros: QueryFn[] = [
      q => (CAIXA_FILTRO_FN(caixa) ? q.where('caixaFinanceiro', '==', caixa) : q),
      q => q.orderBy('dataTransacao', 'desc').orderBy('dataCadastro', 'desc'),
      q => (limite ? q.limit(limite) : q)
    ];

    return this.obterColecao(filtros).pipe(switchMap(c => c.valueChanges()));
  }

  private obterColecao(filtros?: QueryFn[]) {
    return this.firebase.obterColecao<Transacao>(u => ({
      colecao: `usuarios/${u.uid}/transacoes`,
      filtros
    }));
  }
}
