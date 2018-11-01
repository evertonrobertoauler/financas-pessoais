import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { login } from '../../../ngxs';
import { AlertController } from '@ionic/angular';

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
  constructor(private store: Store, private alertCtrl: AlertController) {}

  async sair() {
    const handler = () => this.store.dispatch(new login.Deslogar());
    const alert = await this.alertCtrl.create({
      header: 'Atenção',
      message: 'Você tem certeza que deseja sair / deslogar?',
      buttons: [{ text: 'Não' }, { text: 'Sim', handler }]
    });

    await alert.present();
  }
}
