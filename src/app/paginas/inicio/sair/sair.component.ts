import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { login } from '../../../ngxs';

@Component({
  selector: 'app-sair',
  template: `
    <ion-button color="light" (click)="sair()">
      <ion-icon slot="icon-only" name="log-out"></ion-icon>
    </ion-button>
  `,
  styles: []
})
export class SairComponent {
  constructor(private store: Store) {}

  sair() {
    this.store.dispatch(new login.Deslogar());
  }
}
