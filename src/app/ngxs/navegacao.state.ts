import { State, StateContext, Action, NgxsOnInit, Selector } from '@ngxs/store';
import { Router, NavigationExtras, NavigationEnd } from '@angular/router';
import * as actions from './navegacao.actions';
import { Lista, popularLista } from './helpers';
import { filter, scan } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { combineLatest } from 'rxjs';

export const navegacao = actions;

export const ROTA_LOGIN = '/login';
export const ROTA_PADRAO = '/inicio/(saldo:saldo)';

export interface NavModel {
  historico: Lista<string>;
}

@State<NavModel>({
  name: 'NavegacaoStatee',
  defaults: { historico: popularLista([ROTA_PADRAO]) }
})
export class NavegacaoState implements NgxsOnInit {
  @Selector()
  static podeVoltar({ historico }: NavModel) {
    return !!historico.get(-2);
  }

  @Selector()
  static telaLogin({ historico }: NavModel) {
    return historico.last() === ROTA_LOGIN;
  }

  @Selector()
  static telaAtual({ historico }: NavModel) {
    return historico.last<string>() || '';
  }

  constructor(private router: Router, private ngZone: NgZone, private platform: Platform) {}

  ngxsOnInit(ctx: StateContext<NavModel>) {
    const eventos$ = this.router.events.pipe(
      filter<NavigationEnd>(e => e instanceof NavigationEnd)
    );

    eventos$.subscribe(evento => {
      const { historico } = ctx.getState();
      const url = evento.urlAfterRedirects || evento.url;

      if (url === historico.get(-2)) {
        ctx.patchState({ historico: historico.pop() });
      } else if (url !== historico.last()) {
        ctx.patchState({ historico: historico.push(url) });
      }
    });

    if (this.platform.is('cordova') && this.platform.is('android')) {
      const tamanho = () => ctx.getState().historico.size;

      combineLatest(eventos$, this.platform.backButton)
        .pipe(scan<any>(l => [l[1], tamanho()], [0, tamanho()]))
        .pipe(filter(l => l[0] === 1 && l[1] === 1))
        .subscribe(() => (window as any).navigator.app.exitApp());
    }
  }

  @Action(actions.NavegarPara)
  async navegarPara(ctx: StateContext<NavModel>, action: actions.NavegarPara) {
    const { caminho, atualizarUrl, limparHistorico } = action.payload;
    const historico = limparHistorico ? popularLista([]) : ctx.getState().historico;
    ctx.patchState({ historico });
    await this.navegarParaCaminho(caminho, { skipLocationChange: atualizarUrl === false });
  }

  @Action(actions.VoltarParaTelaAnterior)
  async voltarParaTelaAnterior(ctx: StateContext<NavModel>) {
    const historico = ctx.getState().historico.pop();

    if (historico.size) {
      history.back();
    }
  }

  private async navegarParaCaminho(caminho: string | string[], extras?: NavigationExtras) {
    await this.ngZone.run(async () => {
      if (typeof caminho === 'string') {
        await this.router.navigateByUrl(caminho, extras);
      } else {
        await this.router.navigate(caminho, extras);
      }
    });
  }
}
