import { State, Action, NgxsOnInit, StateContext, Selector, createSelector } from '@ngxs/store';
import * as actions from './caixa-financeiro.actions';
import { CaixaFinanceiro } from '../interfaces';
import { CaixaFinanceiroService } from '../servicos';

export const caixaFinanceiro = actions;

export interface CxModel {
  saldoAtual: number;
  saldoFuturo: number;
  caixasFinanceiros: CaixaFinanceiro[];
}

@State<CxModel>({
  name: 'CaixaFinanceiroState',
  defaults: {
    saldoAtual: 0,
    saldoFuturo: 0,
    caixasFinanceiros: []
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
    return state.caixasFinanceiros;
  }

  static caixaFinanceiro(id: string) {
    return createSelector([CaixaFinanceiroState], (state: CxModel) => {
      return state.caixasFinanceiros.find(cx => cx.id === id);
    }) as () => CaixaFinanceiro;
  }

  constructor(private caixa: CaixaFinanceiroService) {}

  ngxsOnInit(ctx: StateContext<CxModel>) {
    this.caixa.obterTodos().subscribe(list => {
      ctx.patchState({
        saldoAtual: list.reduce((v, c) => v + (c.saldoAtual || 0), 0),
        saldoFuturo: list.reduce((v, c) => v + (c.saldoFuturo || 0), 0),
        caixasFinanceiros: list
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
}
