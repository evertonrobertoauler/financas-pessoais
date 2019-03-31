import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { STATES, LoginState } from './ngxs';
import { PAGINAS } from './paginas';
import { COMPONENTES } from './componentes';
import { DIRETIVAS } from './diretivas';
import { PIPES } from './pipes';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { NgxsModule } from '@ngxs/store';
import { ReactiveFormsModule } from '@angular/forms';
import { CARREGANDO_SELECTOR, LOGADO_SELECTOR } from './guardas';

if (window.location.hash) {
  console.log('#### HASH ####', window.location.hash);
  window.location.hash = '';
}

@NgModule({
  declarations: [AppComponent, ...PAGINAS, ...COMPONENTES, ...DIRETIVAS, ...PIPES],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot({ backButtonText: 'Voltar' }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    NgxsModule.forRoot(STATES, { developmentMode: !environment.production }),
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FunctionsRegionToken, useValue: 'us-central1' },
    { provide: CARREGANDO_SELECTOR, useValue: LoginState.carregando },
    { provide: LOGADO_SELECTOR, useValue: LoginState.logado }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
