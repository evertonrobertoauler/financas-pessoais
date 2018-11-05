import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { LoginState, navegacao } from '../ngxs';
import { filter, switchMap, tap, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const login = route.url[0].path === 'login';

    let action;

    if (login) {
      action = new navegacao.NavegarPara({
        caminho: 'inicio',
        limparHistorico: true
      });
    } else {
      action = new navegacao.NavegarPara({
        caminho: 'login',
        limparHistorico: true,
        atualizarUrl: false
      });
    }

    return this.store
      .select(LoginState.carregando)
      .pipe(filter(c => !c))
      .pipe(switchMap(() => this.store.select(LoginState.logado)))
      .pipe(map(logado => logado !== login))
      .pipe(tap(podeAtivar => !podeAtivar && this.store.dispatch(action)));
  }
}
