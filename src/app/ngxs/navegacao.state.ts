import { NgZone, InjectionToken, Inject } from '@angular/core';
import { State, NgxsOnInit, Selector, StateContext, Action } from '@ngxs/store';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Ngxs } from './helpers';
import { timer } from 'rxjs';

export const TELA_LOGIN = new InjectionToken<string>('TELA_LOGIN');
export const TELA_INICIAL = new InjectionToken<string>('TELA_INICIAL');

export namespace Navegacao {
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
      historico: Ngxs.popularLista([])
    });

    if (this.platform.is('cordova') && this.platform.is('android')) {
      this.platform.backButton.subscribe(() => {
        const { historico, modais } = ctx.getState();

        if (modais === 0) {
          if (historico.size === 1) {
            (window as any).navigator.app.exitApp();
          } else if (historico.size > 1) {
            ctx.dispatch(new Navegacao.VoltarParaTelaAnterior());
          }
        }
      });
    }
  }

  @Action(Navegacao.NavegarPara)
  async navegarPara(ctx: StateContext<NavModel>, action: Navegacao.NavegarPara) {
    await timer(100).toPromise();

    const { caminho } = action.payload;
    let { nivel } = action.payload;

    if (ctx.getState().historico.last() === caminho) {
      console.warn(`navegarPara ${ctx.getState().historico.last()} === ${caminho}`);
      return null;
    }

    if (nivel && nivel < 0) {
      nivel = ctx.getState().historico.size + nivel;
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

  @Action(Navegacao.NavegarParaTelaLogin)
  async navegarParaTelaLogin(ctx: StateContext<NavModel>) {
    ctx.dispatch(
      new Navegacao.NavegarPara({
        caminho: ctx.getState().telaLogin,
        nivel: 1
      })
    );
  }

  @Action(Navegacao.NavegarParaTelaInicial)
  async navegarParaTelaInicial(ctx: StateContext<NavModel>) {
    ctx.dispatch(
      new Navegacao.NavegarPara({
        caminho: ctx.getState().telaInicial,
        nivel: 1
      })
    );
  }
  @Action(Navegacao.VoltarParaTelaAnterior)
  async voltarParaTelaAnterior(ctx: StateContext<NavModel>) {
    const historicoAtual = ctx.getState().historico;
    const historicoNovo = ctx.getState().historico.pop();

    if (historicoNovo.size) {
      ctx.patchState({ historico: historicoNovo });

      const url: string = historicoNovo.last();

      if (!(await this.navegarParaCaminho(url)) && this.router.url !== url) {
        console.warn('voltarParaTelaAnterior', this.router.url, historicoAtual.toArray());
        ctx.patchState({ historico: historicoAtual });
      }
    }
  }

  @Action(Navegacao.ModalAdicionado)
  async modalAdicionado(ctx: StateContext<NavModel>) {
    ctx.patchState({ modais: ctx.getState().modais + 1 });
  }

  @Action(Navegacao.ModalRemovido)
  async modalRemovido(ctx: StateContext<NavModel>) {
    ctx.patchState({ modais: ctx.getState().modais - 1 });
  }

  private async navegarParaCaminho(caminho: string) {
    return await this.ngZone.run(async () => {
      return await this.router.navigateByUrl(caminho);
    });
  }
}
