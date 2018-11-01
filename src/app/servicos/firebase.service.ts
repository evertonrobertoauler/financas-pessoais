import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { environment } from '../../environments/environment';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, filter, map } from 'rxjs/operators';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Timestamp } from '@firebase/firestore-types';
import { User } from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(
    private platform: Platform,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  obterUsuarioLoginObservable() {
    return this.auth.user.pipe(filter(u => !!(u && u.uid)));
  }

  async obterUsuarioLogin() {
    return await this.auth.user.pipe(first()).toPromise();
  }

  async loginComGoogle() {
    if (this.platform.is('cordova')) {
      const credencial = await this.obterCredencialGoogle();
      await this.auth.auth.signInAndRetrieveDataWithCredential(credencial);
    } else {
      await this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    return await this.obterUsuarioLogin();
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

  obterColecao<T = any>(fn: (user: User) => { colecao: string; filtros?: QueryFn[] }) {
    return this.obterUsuarioLoginObservable().pipe(
      map(user => {
        const { colecao, filtros } = fn(user);
        return this.firestore.collection<T>(colecao, this.queryFn(...(filtros || [])));
      })
    );
  }

  obterDoc<T = any>(caminho: string) {
    return this.obterUsuarioLoginObservable().pipe(map(() => this.firestore.doc<T>(caminho)));
  }

  queryFn(...filtros: QueryFn[]): QueryFn {
    return query => filtros.reduce((q, f) => f(q), query);
  }

  jsonStringify(dados: any) {
    return JSON.stringify(dados, (_, v) => this.dateToJson(v) || v) || 'null';
  }

  jsonParse(json: string) {
    return JSON.parse(json || null, (_, v) => this.anyToDate(v) || v);
  }

  anyToDate(data): Date {
    if (data) {
      if (data.toDate) {
        return data.toDate();
      }

      if (typeof data === 'string') {
        if (data.match(/^\d+-\d+-\d+T\d+:\d+:\d+\.\d+Z$/)) {
          return new Date(data);
        } else if (data === 'firestore.FieldValue.serverTimestamp') {
          return this.serverTimestamp() as any;
        }
      }

      if (data instanceof Date) {
        return data;
      }
    }
  }

  dateToJson(data): string {
    if (data) {
      if (data.toDate) {
        return data.toDate().toJSON();
      }

      if (data instanceof Date) {
        return data.toJSON();
      }

      if (data instanceof firebase.firestore.FieldValue) {
        return 'firestore.FieldValue.serverTimestamp';
      }
    }
  }

  serverTimestamp(): Timestamp {
    return firebase.firestore.FieldValue.serverTimestamp() as any;
  }

  gerarNovoId() {
    return this.firestore.createId();
  }
}
