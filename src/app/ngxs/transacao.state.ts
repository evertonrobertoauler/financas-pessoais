import { State, Action } from '@ngxs/store';
import * as actions from './transacao.actions';

export const transacao = actions;

@State({
  name: 'TransacaoState',
  defaults: null
})
export class TransacaoState {
  constructor() {}

  @Action(actions.InserirTransacao)
  async inserirTransacao(_: any, action: actions.InserirTransacao) {
    console.log(action);
  }

  @Action(actions.ExcluirTransacao)
  async excluirTransacao(_: any, action: actions.ExcluirTransacao) {
    console.log(action);
  }
}
