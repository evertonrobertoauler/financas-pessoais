import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Store } from '@ngxs/store';
import { LoginState } from './ngxs';
import { Observable, combineLatest } from 'rxjs';
import { tap, switchMap, filter, shareReplay, first } from 'rxjs/operators';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private URL_LOGIN = '/login';
  private URL_INICIO = '/inicio/(saldo:saldo)';
  private loading: HTMLIonLoadingElement;

  public login$: Observable<any>;
  public btnVoltar$: Observable<any>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private store: Store,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    const carregando$ = this.store
      .select(LoginState.carregando)
      .pipe(tap(carregando => this.mostrarLoading(carregando)))
      .pipe(shareReplay(1));

    const evento$ = this.router.events
      .pipe(filter<NavigationStart>(e => e instanceof NavigationStart))
      .pipe(shareReplay(1));

    const logado$ = this.store.select(LoginState.logado).pipe(shareReplay(1));

    this.login$ = combineLatest(carregando$, evento$)
      .pipe(filter(([carregando]) => !carregando))
      .pipe(switchMap(() => combineLatest(logado$, evento$)))
      .pipe(tap(([logado, evento]) => this.corrigirNavegacao(logado, evento)));

    this.btnVoltar$ = this.platform.backButton
      .pipe(switchMap(() => evento$.pipe(first())))
      .pipe(tap(evento => this.fecharAplicativo(evento)));
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

  private async corrigirNavegacao(logado: boolean, evento: NavigationStart) {
    if (!logado && evento.url !== this.URL_LOGIN) {
      this.router.navigateByUrl(this.URL_LOGIN, { skipLocationChange: true });
    } else if (logado && evento.url === this.URL_LOGIN) {
      this.router.navigateByUrl(this.URL_INICIO);
    }
  }

  private fecharAplicativo(evento: NavigationStart) {
    if (
      [this.URL_INICIO, this.URL_LOGIN, '/', ''].indexOf(evento.url) !== -1 &&
      this.platform.is('cordova') &&
      this.platform.is('android')
    ) {
      (window as any).navigator.app.exitApp();
    }
  }
}
