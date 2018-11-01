import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { environment } from '../../environments/environment';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(private platform: Platform, private auth: AngularFireAuth) {}

  async loginComGoogle() {
    if (this.platform.is('cordova')) {
      const credencial = await this.obterCredencialGoogle();
      await this.auth.auth.signInAndRetrieveDataWithCredential(credencial);
    } else {
      await this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    return await this.auth.user.pipe(first()).toPromise();
  }

  async deslogar() {
    await this.auth.auth.signOut();
  }

  private async obterCredencialGoogle() {
    const win: any = window;

    try {
      const login = await new Promise<any>((resolve, reject) => {
        const options = { offline: false, webClientId: environment.webClientId };
        const onLogin = obj => win.plugins.googleplus.disconnect(() => resolve(obj));
        win.plugins.googleplus.login(options, onLogin, reject);
      });

      return firebase.auth.GoogleAuthProvider.credential(login.idToken, login.accessToken);
    } catch (e) {
      console.error('gerarCredencialGoogle', e);
      throw e;
    }
  }
}
