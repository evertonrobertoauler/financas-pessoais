import { State, Action } from '@ngxs/store';
import * as actions from './caixa-financeiro.actions';

export const caixaFinanceiro = actions;

@State({
  name: 'CaixaFinanceiroState'
})
export class CaixaFinanceiroState {
  constructor() {}

  @Action(actions.SalvarCaixaFinanceiro)
  async salvarCaixaFinanceiro(_: any, action: actions.SalvarCaixaFinanceiro) {
    console.log(action);
  }
}
