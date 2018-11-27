import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, FirestoreSettingsToken, Settings } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { STATES } from './ngxs';
import { SERVICOS } from './servicos';
import { PAGINAS } from './paginas';
import { COMPONENTES } from './componentes';
import { DIRETIVAS } from './diretivas';
import { PIPES } from './pipes';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { NgxsModule } from '@ngxs/store';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, ...PAGINAS, ...COMPONENTES, ...DIRETIVAS, ...PIPES],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    NgxsModule.forRoot(STATES),
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: FirestoreSettingsToken,
      useValue: { timestampsInSnapshots: true } as Settings
    },
    { provide: FunctionsRegionToken, useValue: 'us-central1' },
    ...SERVICOS
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
