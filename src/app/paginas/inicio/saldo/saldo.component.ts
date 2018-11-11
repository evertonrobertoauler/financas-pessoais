import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CaixaFinanceiroState, navegacao, transacao } from '../../../ngxs';
import { CaixaFinanceiro } from '../../../interfaces';
import { FILTRO_TODOS_CAIXAS } from '../../../servicos';

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
    this.store.dispatch(new transacao.FiltrarPorCaixa({ filtroCaixa: FILTRO_TODOS_CAIXAS }));
    this.store.dispatch(new navegacao.NavegarPara({ caminho: '/operacao/(operacao:transacao)' }));
  }

  abrirExtrato(caixa: CaixaFinanceiro) {
    this.store.dispatch(new transacao.FiltrarPorCaixa({ filtroCaixa: caixa.id }));
    this.store.dispatch(new navegacao.NavegarPara({ caminho: '/inicio/(extrato:extrato)' }));
  }

  calcularSaldoFuturo(caixa: CaixaFinanceiro) {
    return (caixa.saldoAtual || 0) + (caixa.saldoFuturo || 0);
  }
}
