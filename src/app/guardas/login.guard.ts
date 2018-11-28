import { Injectable, InjectionToken, Inject } from '@angular/core';
import { CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { navegacao, TELA_LOGIN, NavegacaoState } from '../ngxs';
import { filter, switchMap, map, tap } from 'rxjs/operators';

export const CARREGANDO_SELECTOR = new InjectionToken<() => boolean>('CARREGANDO_SELECTOR');
export const LOGADO_SELECTOR = new InjectionToken<() => boolean>('LOGADO_SELECTOR');

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(
    private store: Store,
    @Inject(CARREGANDO_SELECTOR) private carregandoFn: () => boolean,
    @Inject(LOGADO_SELECTOR) private logadoFn: () => boolean,
    @Inject(TELA_LOGIN) private telaLogin: string
  ) {}

  canActivate(_, state: RouterStateSnapshot): boolean | Observable<boolean> {
    const url = state.url;
    const telaAtual = this.store.selectSnapshot(NavegacaoState.telaAtual);

    if (url !== telaAtual) {
      return false;
    }

    const login = url === this.telaLogin;

    const action = login
      ? new navegacao.NavegarParaTelaInicial()
      : new navegacao.NavegarParaTelaLogin();

    return this.store
      .select(this.carregandoFn)
      .pipe(filter(c => !c))
      .pipe(switchMap(() => this.store.select(this.logadoFn)))
      .pipe(map(logado => logado !== login))
      .pipe(tap(podeAtivar => !podeAtivar && this.store.dispatch(action)));
  }
}
