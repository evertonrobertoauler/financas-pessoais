import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { login } from '../../ngxs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private store: Store) {}

  entrar() {
    this.store.dispatch(new login.LogarComGoogle());
  }
}
