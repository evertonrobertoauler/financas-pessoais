import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CaixaFinanceiroState, Navegacao, transacao, caixaFinanceiro } from '../../../ngxs';
import { CaixaFinanceiro } from '../../../interfaces';
import { FILTRO_TODOS_CAIXAS } from '../../../servicos';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-inicio-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.scss']
})
export class InicioSaldoComponent implements OnInit {
  public saldoAtual$: Observable<number>;
  public saldoFuturo$: Observable<number>;
  public caixasFinanceiros$: Observable<CaixaFinanceiro[]>;

  constructor(private store: Store, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.saldoAtual$ = this.store.select(CaixaFinanceiroState.saldoAtual);
    this.saldoFuturo$ = this.store.select(CaixaFinanceiroState.saldoFuturo);
    this.caixasFinanceiros$ = this.store.select(CaixaFinanceiroState.caixasFinanceiros);
  }

  trackByFn(_, item: CaixaFinanceiro) {
    return item.id;
  }

  async recalcularSaldoTotal() {
    const acao = new caixaFinanceiro.RecalcularSaldoTotal();

    const handler = () => this.store.dispatch(acao);
    const alert = await this.alertCtrl.create({
      header: 'Atenção',
      message: 'Você tem certeza que deseja recalcular o saldo de todos os caixas?',
      buttons: [{ text: 'Não' }, { text: 'Sim', handler }]
    });

    await alert.present();
  }

  editarCaixa(caixa: CaixaFinanceiro) {
    const caminho = `/caixa-financeiro/${caixa.id}`;
    this.store.dispatch(new Navegacao.NavegarPara({ caminho }));
  }

  adicionarCaixa() {
    this.store.dispatch(new Navegacao.NavegarPara({ caminho: '/caixa-financeiro' }));
  }

  adicionarOperacao() {
    this.store.dispatch(new transacao.FiltrarPorCaixa({ filtroCaixa: FILTRO_TODOS_CAIXAS }));
    this.store.dispatch(new Navegacao.NavegarPara({ caminho: '/operacao/transacao' }));
  }

  abrirExtrato(caixa: CaixaFinanceiro) {
    this.store.dispatch(new transacao.FiltrarPorCaixa({ filtroCaixa: caixa.id }));
    this.store.dispatch(new Navegacao.NavegarPara({ caminho: '/inicio/extrato' }));
  }

  calcularSaldoFuturo(caixa: CaixaFinanceiro) {
    return (caixa.saldoAtual || 0) + (caixa.saldoFuturo || 0);
  }
}
