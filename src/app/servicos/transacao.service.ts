import { Injectable } from '@angular/core';
import { TIPO_TRANSACAO, Transacao } from '../interfaces';
import { FirebaseService } from './firebase.service';
import { FormatarDadosService } from './formatar-dados.service';
import { first, switchMap } from 'rxjs/operators';
import { QueryFn } from '@angular/fire/firestore';

export const TIPOS_TRANSACAO: TIPO_TRANSACAO[] = ['Receita', 'Despesa'];

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {
  constructor(private firebase: FirebaseService, private formatarDados: FormatarDadosService) {}

  salvar(dados: Partial<Transacao>) {
    dados = {
      ...dados,
      id: dados.id || this.firebase.gerarNovoId(),
      descricao: this.formatarDados.capitalizar(dados.descricao),
      valor: this.formatarDados.valorToNumber(dados.valor),
      dataCadastro: dados.dataCadastro || this.firebase.serverTimestamp()
    };

    return this.obterColecao()
      .pipe(first())
      .pipe(switchMap(c => this.firebase.operacao('salvar', c.doc(dados.id), dados)))
      .toPromise();
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

  obterTodos() {
    const filtros: QueryFn = q =>
      q.orderBy('dataTransacao', 'desc').orderBy('dataCadastro', 'desc');

    return this.obterColecao([filtros]).pipe(switchMap(c => c.valueChanges()));
  }

  private obterColecao(filtros?: QueryFn[]) {
    return this.firebase.obterColecao<Transacao>(u => ({
      colecao: `usuarios/${u.uid}/transacoes`,
      filtros
    }));
  }
}
