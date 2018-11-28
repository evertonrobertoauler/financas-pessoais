import { NgZone, InjectionToken, Inject } from '@angular/core';
import { State, NgxsOnInit, Selector, StateContext, Action } from '@ngxs/store';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Ngxs } from './helpers';

export const TELA_LOGIN = new InjectionToken<string>('TELA_LOGIN');
export const TELA_INICIAL = new InjectionToken<string>('TELA_INICIAL');

export namespace navegacao {
  export class NavegarPara {
    static readonly type = '[Lib/Navegação] Navegar para]';
    constructor(
      public payload: {
        caminho: string;
        nivel?: number;
      }
    ) {}
  }

  export class NavegarParaTelaInicial {
    static readonly type = '[Lib/Navegação] Navegar p/ tela padrão]';
  }

  export class NavegarParaTelaLogin {
    static readonly type = '[Lib/Navegação] Navegar p/ tela login]';
  }

  export class VoltarParaTelaAnterior {
    static readonly type = '[Lib/Navegação] Voltar p/ tela anterior]';
  }

  export class ModalAdicionado {
    static readonly type = '[Lib/Navegação] Modal adicionado]';
  }

  export class ModalRemovido {
    static readonly type = '[Lib/Navegação] Modal removido]';
  }
}

export interface NavModel {
  historico: Ngxs.Lista<string>;
  telaLogin?: string;
  telaInicial?: string;
  modais: number;
}

@State<NavModel>({
  name: 'NavegacaoState',
  defaults: { historico: Ngxs.popularLista([]), modais: 0 }
})
export class NavegacaoState implements NgxsOnInit {
  @Selector()
  static podeVoltar({ historico }: NavModel) {
    return !!historico.get(-2);
  }

  @Selector()
  static telaLogin({ historico, telaLogin }: NavModel) {
    return historico.last() === telaLogin;
  }

  @Selector()
  static telaInicial({ historico, telaInicial }: NavModel) {
    return historico.last() === telaInicial;
  }

  @Selector()
  static telaAtual({ historico }: NavModel) {
    return historico.last<string>() || '';
  }

  @Selector()
  static historico({ historico }: NavModel) {
    return historico;
  }

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private platform: Platform,
    @Inject(TELA_LOGIN) private telaLogin: string,
    @Inject(TELA_INICIAL) private telaInicial: string
  ) {}

  ngxsOnInit(ctx: StateContext<NavModel>) {
    ctx.patchState({
      telaLogin: this.telaLogin,
      telaInicial: this.telaInicial,
      historico: Ngxs.popularLista([this.telaInicial])
    });

    if (this.platform.is('cordova') && this.platform.is('android')) {
      this.platform.backButton.subscribe(() => {
        const { historico, modais } = ctx.getState();

        if (modais === 0) {
          if (historico.size === 1) {
            (window as any).navigator.app.exitApp();
          } else if (historico.size > 1) {
            ctx.dispatch(new navegacao.VoltarParaTelaAnterior());
          }
        }
      });
    }
  }

  @Action(navegacao.NavegarPara)
  async navegarPara(ctx: StateContext<NavModel>, action: navegacao.NavegarPara) {
    const { caminho } = action.payload;

    if (ctx.getState().historico.last() !== caminho) {
      let nivel = action.payload.nivel;

      if (action.payload.nivel && action.payload.nivel < 0) {
        nivel = ctx.getState().historico.size + action.payload.nivel;
      }

      let historico = nivel ? ctx.getState().historico.take(nivel - 1) : ctx.getState().historico;
      historico = historico.push(caminho);

      ctx.patchState({ historico });

      if (!(await this.navegarParaCaminho(caminho))) {
        if (historico.size > 1) {
          ctx.patchState({ historico: historico.pop() });
        }
      }
    }
  }

  @Action(navegacao.NavegarParaTelaLogin)
  async navegarParaTelaLogin(ctx: StateContext<NavModel>) {
    ctx.dispatch(
      new navegacao.NavegarPara({
        caminho: ctx.getState().telaLogin,
        nivel: 1
      })
    );
  }

  @Action(navegacao.NavegarParaTelaInicial)
  async navegarParaTelaInicial(ctx: StateContext<NavModel>) {
    ctx.dispatch(
      new navegacao.NavegarPara({
        caminho: ctx.getState().telaInicial,
        nivel: 1
      })
    );
  }

  @Action(navegacao.VoltarParaTelaAnterior)
  async voltarParaTelaAnterior(ctx: StateContext<NavModel>) {
    const historicoAtual = ctx.getState().historico;
    const historicoNovo = ctx.getState().historico.pop();

    if (historicoNovo.size) {
      ctx.patchState({ historico: historicoNovo });

      if (!(await this.navegarParaCaminho(historicoNovo.last()))) {
        ctx.patchState({ historico: historicoAtual });
      }
    }
  }

  @Action(navegacao.ModalAdicionado)
  async modalAdicionado(ctx: StateContext<NavModel>) {
    ctx.patchState({ modais: ctx.getState().modais + 1 });
  }

  @Action(navegacao.ModalRemovido)
  async modalRemovido(ctx: StateContext<NavModel>) {
    ctx.patchState({ modais: ctx.getState().modais - 1 });
  }

  private async navegarParaCaminho(caminho: string) {
    return await this.ngZone.run(async () => {
      return await this.router.navigateByUrl(caminho);
    });
  }
}
