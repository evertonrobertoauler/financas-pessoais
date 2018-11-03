import { State, Action, NgxsOnInit, StateContext, Selector, createSelector } from '@ngxs/store';
import * as actions from './transacao.actions';
import { TransacaoService } from '../servicos';
import { Transacao } from '../interfaces';

export const transacao = actions;

export interface TrModel {
  transacoes: Transacao[];
}

@State<TrModel>({
  name: 'TransacaoState',
  defaults: {
    transacoes: []
  }
})
export class TransacaoState implements NgxsOnInit {
  @Selector()
  static transacoes(state: TrModel) {
    return state.transacoes;
  }

  static transacao(id: string) {
    return createSelector([TransacaoState], (state: TrModel) => {
      return state.transacoes.find(cx => cx.id === id);
    }) as () => Transacao;
  }

  constructor(private service: TransacaoService) {}

  ngxsOnInit(ctx: StateContext<TrModel>) {
    this.service.obterTodos().subscribe(transacoes => ctx.patchState({ transacoes }));
  }

  @Action(actions.SalvarTransacao)
  async inserirTransacao(_: any, action: actions.SalvarTransacao) {
    await this.service.salvar(action.payload);
  }

  @Action(actions.ExcluirTransacao)
  async excluirTransacao(_: any, action: actions.ExcluirTransacao) {
    await this.service.excluir(action.payload.id);
  }
}
