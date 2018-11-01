import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, FirestoreSettingsToken, Settings } from '@angular/fire/firestore';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { FirebaseService } from './servicos/firebase.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './paginas/login/login.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { SaldoComponent } from './paginas/inicio/saldo/saldo.component';
import { ExtratoComponent } from './paginas/inicio/extrato/extrato.component';
import { AdicionarComponent } from './paginas/inicio/adicionar/adicionar.component';
import { MenuComponent } from './paginas/inicio/adicionar/menu/menu.component';
import { SairComponent } from './paginas/inicio/sair/sair.component';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    SaldoComponent,
    ExtratoComponent,
    AdicionarComponent,
    MenuComponent,
    SairComponent
  ],
  entryComponents: [MenuComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: FirestoreSettingsToken,
      useValue: { timestampsInSnapshots: true } as Settings
    },
    FirebaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
