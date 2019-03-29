import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Store } from '@ngxs/store';
import { LoginState, caixaFinanceiro, Navegacao } from './ngxs';
import { Observable, EMPTY } from 'rxjs';
import { tap, filter, switchMap, first, delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private loading: HTMLIonLoadingElement;

  public loading$: Observable<any>;
  public logado$: Observable<any>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private store: Store,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    this.loading$ = this.store
      .select(LoginState.carregando)
      .pipe(tap(carregando => this.mostrarLoading(carregando)));

    this.logado$ = this.store
      .select(LoginState.logado)
      .pipe(filter(l => l))
      .pipe(switchMap(() => this.store.dispatch(new caixaFinanceiro.RecalcularSaldoParcial())));

    this.store.dispatch(new Navegacao.NavegarParaTelaInicial());

    const logado = await this.store
      .select(LoginState.carregando)
      .pipe(switchMap(c => (c ? EMPTY : this.store.select(LoginState.logado))))
      .pipe(first())
      .pipe(delay(50))
      .toPromise();

    if (logado) {
      await this.store.dispatch(new Navegacao.NavegarParaTelaInicial()).toPromise;
    } else {
      await this.store.dispatch(new Navegacao.NavegarParaTelaLogin()).toPromise();
    }
  }

  private async mostrarLoading(carregando: boolean) {
    if (this.platform.is('cordova')) {
      await this.platform.ready();

      if (carregando) {
        await this.splashScreen.show();
      } else {
        await this.splashScreen.hide();
      }
    } else {
      if (!this.loading) {
        this.loading = await this.loadingCtrl.create({});
      }

      if (carregando) {
        await this.loading.present();
      } else {
        await this.loading.dismiss();
      }
    }
  }
}
