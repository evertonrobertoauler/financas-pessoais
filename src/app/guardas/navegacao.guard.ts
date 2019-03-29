import { Injectable, Inject, InjectionToken } from '@angular/core';
import { CanActivate, CanDeactivate } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { NavegacaoState } from '../ngxs';
import { filter, switchMap, map, tap } from 'rxjs/operators';

export const CARREGANDO_SELECTOR = new InjectionToken<() => boolean>('CARREGANDO_SELECTOR');
export const LOGADO_SELECTOR = new InjectionToken<() => boolean>('LOGADO_SELECTOR');

@Injectable({
  providedIn: 'root'
})
export class NavegacaoGuard implements CanActivate, CanDeactivate<any> {
  constructor(
    private store: Store,
    @Inject(CARREGANDO_SELECTOR) private carregandoFn: () => boolean,
    @Inject(LOGADO_SELECTOR) private logadoFn: () => boolean
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    const url = state.url;
    const telaAtual = this.store.selectSnapshot(NavegacaoState.telaAtual) || '/';

    if (url !== telaAtual) {
      console.warn(`NavegacaoGuard.canActivate: '${url}' !== '${telaAtual}'`);
      return false;
    }

    const configLogado = route.data.logado;

    return this.store
      .select(this.carregandoFn)
      .pipe(filter(c => !c))
      .pipe(switchMap(() => this.store.select(this.logadoFn)))
      .pipe(map(logado => (logado ? configLogado !== false : configLogado !== true)))
      .pipe(tap(podeAtivar => !podeAtivar && console.warn(`NavegacaoGuard !podeAtivar '${url}'`)));
  }

  canDeactivate(_, __, ___, next?: RouterStateSnapshot): boolean {
    const telaAtual = this.store.selectSnapshot(NavegacaoState.telaAtual);
    const sim = !next || next.url === telaAtual;

    if (!sim) {
      console.warn(`NavegacaoGuard.canDeactivate: '${next.url}' !== '${telaAtual}'`);
    }

    return sim;
  }
}
