import { State, Action, NgxsOnInit, StateContext, Selector, createSelector } from '@ngxs/store';
import * as actions from './transacao.actions';
import { TransacaoService, FILTRO_TODOS_CAIXAS, CAIXA_FILTRO_FN, PAGINACAO } from '../servicos';
import { Transacao } from '../interfaces';
import { popularEntidade, Entidade, obterValoresEntidade } from './helpers';
import { Subscription } from 'rxjs';

export const transacao = actions;

export interface TrModel {
  filtroCaixa: string;
  transacoes: Entidade<Transacao>;
  limit: number;
}

@State<TrModel>({
  name: 'TransacaoState',
  defaults: {
    transacoes: popularEntidade([]),
    filtroCaixa: FILTRO_TODOS_CAIXAS,
    limit: PAGINACAO
  }
})
export class TransacaoState implements NgxsOnInit {
  private filtro: Subscription;

  @Selector()
  static transacoes(state: TrModel) {
    return obterValoresEntidade(state.transacoes);
  }

  @Selector()
  static filtroCaixa(state: TrModel) {
    return state.filtroCaixa;
  }

  @Selector()
  static caixaSelecionado(state: TrModel) {
    return CAIXA_FILTRO_FN(state.filtroCaixa);
  }

  @Selector()
  static possuiTransacoesAnteriores(state: TrModel) {
    return state.transacoes.ids.size === state.limit;
  }

  static transacao(id: string): () => Transacao {
    const seletor = (state: TrModel) => state.transacoes.entidades.get(id);
    return createSelector(
      [TransacaoState],
      seletor
    );
  }

  constructor(private service: TransacaoService) {}

  ngxsOnInit(ctx: StateContext<TrModel>) {
    const fn = list => ctx.patchState({ transacoes: popularEntidade(list) });
    this.filtro = this.service.obterTodos(ctx.getState().filtroCaixa).subscribe(fn);
  }

  @Action(actions.SalvarTransacao)
  async inserirTransacao(_: any, action: actions.SalvarTransacao) {
    await this.service.salvar(action.payload);
  }

  @Action(actions.ExcluirTransacao)
  async excluirTransacao(_: any, action: actions.ExcluirTransacao) {
    await this.service.excluir(action.payload.id);
  }

  @Action(actions.SalvarTransferencia)
  async salvarTransferencia(_: any, action: actions.SalvarTransferencia) {
    await this.service.salvarTransferencia(action.payload);
  }

  @Action(actions.FiltrarPorCaixa)
  async filtrarPorCaixa(ctx: StateContext<TrModel>, action: actions.FiltrarPorCaixa) {
    const filtroCaixa = action.payload.filtroCaixa;

    if (ctx.getState().filtroCaixa === filtroCaixa) {
      return null;
    }

    if (this.filtro instanceof Subscription) {
      this.filtro.unsubscribe();
    }

    const fn = list => ctx.patchState({ transacoes: popularEntidade(list) });
    this.filtro = this.service.obterTodos(filtroCaixa).subscribe(fn);
    ctx.patchState({ filtroCaixa, transacoes: popularEntidade([]), limit: PAGINACAO });
  }

  @Action(actions.CarregarMaisTransacoes)
  async carregarMaisTransacoes(ctx: StateContext<TrModel>) {
    const { transacoes, limit, filtroCaixa } = ctx.getState();
    const size = transacoes.ids.size;

    if (size === limit && size % PAGINACAO === 0) {
      return await new Promise(resolve => {
        const fn = list => {
          resolve();
          ctx.patchState({ transacoes: popularEntidade(list) });
        };

        if (this.filtro instanceof Subscription) {
          this.filtro.unsubscribe();
        }

        this.filtro = this.service.obterTodos(filtroCaixa, size + PAGINACAO).subscribe(fn);
        ctx.patchState({ limit: size + PAGINACAO });
      });
    }
  }
}
