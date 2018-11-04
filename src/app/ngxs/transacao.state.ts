import { State, Action, NgxsOnInit, StateContext, Selector, createSelector } from '@ngxs/store';
import * as actions from './transacao.actions';
import { TransacaoService } from '../servicos';
import { Transacao } from '../interfaces';
import { Mapa, popularMapa, obterValoresMapa } from './helpers';

export const transacao = actions;

export interface TrModel {
  transacoes: Mapa<Transacao>;
}

@State<TrModel>({
  name: 'TransacaoState',
  defaults: {
    transacoes: popularMapa([])
  }
})
export class TransacaoState implements NgxsOnInit {
  @Selector()
  static transacoes(state: TrModel) {
    return obterValoresMapa(state.transacoes);
  }

  static transacao(id: string) {
    const seletor = (state: TrModel) => state.transacoes.get(id);
    return createSelector([TransacaoState], seletor) as () => Transacao;
  }

  constructor(private service: TransacaoService) {}

  ngxsOnInit(ctx: StateContext<TrModel>) {
    const fn = list => ctx.patchState({ transacoes: popularMapa(list) });
    this.service.obterTodos().subscribe(fn);
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
