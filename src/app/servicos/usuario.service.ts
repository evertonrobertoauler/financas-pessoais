import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { switchMap } from 'rxjs/operators';
import { Usuario } from '../interfaces';
import { User } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(private firebase: FirebaseService) {}

  async salvar(user: User) {
    const dados: Usuario = {
      id: user.uid,
      nome: user.displayName,
      email: user.email,
      foto: user.photoURL,
      telefone: user.phoneNumber,
      ultimoAcesso: this.firebase.serverTimestamp()
    };

    return this.firebase
      .obterDoc<Usuario>(`usuarios/${dados.id}`)
      .pipe(switchMap(doc => this.firebase.operacao('salvar', doc, dados)))
      .toPromise();
  }
}
