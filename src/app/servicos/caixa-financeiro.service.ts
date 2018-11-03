import { Injectable } from '@angular/core';
import { TIPO_CAIXA, CaixaFinanceiro } from '../interfaces';
import { FirebaseService } from './firebase.service';
import { switchMap, first } from 'rxjs/operators';
import { QueryFn } from '@angular/fire/firestore';
import { FormatarDadosService } from './formatar-dados.service';

export const TIPOS_CAIXA: TIPO_CAIXA[] = ['Carteira', 'Cartão Crédito'];

@Injectable({
  providedIn: 'root'
})
export class CaixaFinanceiroService {
  constructor(private firebase: FirebaseService, private formatarDados: FormatarDadosService) {}

  salvar(dados: Partial<CaixaFinanceiro>) {
    dados.id = dados.id || this.firebase.gerarNovoId();
    dados.nome = this.formatarDados.capitalizar(dados.nome);

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

  obterCaixa(id: string) {
    return this.obterColecao().pipe(switchMap(c => c.doc(id).valueChanges()));
  }

  obterTodos() {
    return this.obterColecao([q => q.orderBy('nome')]).pipe(switchMap(c => c.valueChanges()));
  }

  private obterColecao(filtros?: QueryFn[]) {
    return this.firebase.obterColecao<CaixaFinanceiro>(u => ({
      colecao: `usuarios/${u.uid}/caixasFinanceiros`,
      filtros
    }));
  }
}
