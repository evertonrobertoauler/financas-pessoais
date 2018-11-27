import { State, Action, NgxsOnInit, StateContext, Selector, createSelector } from '@ngxs/store';
import * as actions from './caixa-financeiro.actions';
import { CaixaFinanceiro } from '../interfaces';
import { CaixaFinanceiroService } from '../servicos';
import { Entidade, popularEntidade, obterValoresEntidade } from './helpers';

export const caixaFinanceiro = actions;

export interface CxModel {
  saldoAtual: number;
  saldoFuturo: number;
  caixasFinanceiros: Entidade<CaixaFinanceiro>;
}

@State<CxModel>({
  name: 'CaixaFinanceiroState',
  defaults: {
    saldoAtual: 0,
    saldoFuturo: 0,
    caixasFinanceiros: popularEntidade([])
  }
})
export class CaixaFinanceiroState implements NgxsOnInit {
  @Selector()
  static saldoAtual(state: CxModel) {
    return state.saldoAtual;
  }

  @Selector()
  static saldoFuturo(state: CxModel) {
    return state.saldoFuturo;
  }

  @Selector()
  static caixasFinanceiros(state: CxModel) {
    return obterValoresEntidade(state.caixasFinanceiros);
  }

  @Selector()
  static possuiCaixasCadastrado(state: CxModel) {
    return state.caixasFinanceiros.ids.size > 0;
  }

  static caixaFinanceiro(id: string) {
    const seletor = (state: CxModel) => state.caixasFinanceiros.entidades.get(id);
    // prettier-ignore
    return createSelector([CaixaFinanceiroState], seletor) as () => CaixaFinanceiro;
  }

  constructor(private caixa: CaixaFinanceiroService) {}

  ngxsOnInit(ctx: StateContext<CxModel>) {
    this.caixa.obterTodos().subscribe(list => {
      ctx.patchState({
        saldoAtual: list.reduce((v, c) => v + (c.saldoAtual || 0), 0),
        saldoFuturo: list.reduce((v, c) => v + (c.saldoAtual || 0) + (c.saldoFuturo || 0), 0),
        caixasFinanceiros: popularEntidade(list)
      });
    });
  }

  @Action(actions.SalvarCaixaFinanceiro)
  async salvarCaixaFinanceiro(_: any, action: actions.SalvarCaixaFinanceiro) {
    await this.caixa.salvar(action.payload);
  }

  @Action(actions.ExcluirCaixaFinanceiro)
  async excluirCaixaFinanceiro(_: any, action: actions.ExcluirCaixaFinanceiro) {
    await this.caixa.excluir(action.payload.id);
  }

  @Action(actions.RecalcularSaldoParcial)
  async recalcularSaldoParcial() {
    try {
      const retorno = await this.caixa.recalcularSaldoParcial().toPromise();
      console.assert(retorno, 'Função recalcularSaldoParcial retornou false!');
    } catch (e) {
      console.error('recalcularSaldoParcial', e);
    }
  }

  @Action(actions.RecalcularSaldoTotal)
  async recalcularSaldoTotal() {
    try {
      const retorno = await this.caixa.recalcularSaldoTotal().toPromise();
      console.assert(retorno, 'Função recalcularSaldoTotal retornou false!');
    } catch (e) {
      console.error('recalcularSaldoTotal', e);
    }
  }
}
