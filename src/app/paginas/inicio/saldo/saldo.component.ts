import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CaixaFinanceiroState, navegacao } from '../../../ngxs';
import { CaixaFinanceiro } from '../../../interfaces';

@Component({
  selector: 'app-inicio-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.scss']
})
export class InicioSaldoComponent implements OnInit {
  public saldoAtual$: Observable<number>;
  public saldoFuturo$: Observable<number>;
  public caixasFinanceiros$: Observable<CaixaFinanceiro[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.saldoAtual$ = this.store.select(CaixaFinanceiroState.saldoAtual);
    this.saldoFuturo$ = this.store.select(CaixaFinanceiroState.saldoFuturo);
    this.caixasFinanceiros$ = this.store.select(CaixaFinanceiroState.caixasFinanceiros);
  }

  editarCaixa(caixa: CaixaFinanceiro) {
    this.store.dispatch(new navegacao.NavegarPara({ caminho: ['caixa-financeiro', caixa.id] }));
  }

  adicionarCaixa() {
    this.store.dispatch(new navegacao.NavegarPara({ caminho: ['caixa-financeiro'] }));
  }

  adicionarOperacao() {
    this.store.dispatch(new navegacao.NavegarPara({ caminho: '/operacao/(operacao:transacao)' }));
  }
}
