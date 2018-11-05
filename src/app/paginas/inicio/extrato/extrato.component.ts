import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Transacao } from '../../../interfaces';
import { TransacaoState, CaixaFinanceiroState, navegacao } from '../../../ngxs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-inicio-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.scss']
})
export class InicioExtratoComponent implements OnInit {
  public transacoes$: Observable<Transacao[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    const caixaFinanceiro = id => this.store.select(CaixaFinanceiroState.caixaFinanceiro(id));

    const transacaoFn = (trans: Transacao) => ({
      ...trans,
      caixaFinanceiro$: caixaFinanceiro(trans.caixaFinanceiro)
    });

    this.transacoes$ = this.store
      .select(TransacaoState.transacoes)
      .pipe(map(list => list.map(t => transacaoFn(t))));
  }

  editarTransacao(transacao: Transacao) {
    this.store.dispatch(new navegacao.NavegarPara({ caminho: ['transacao', transacao.id] }));
  }

  adicionarTransacao() {
    this.store.dispatch(new navegacao.NavegarPara({ caminho: ['transacao'] }));
  }
}
