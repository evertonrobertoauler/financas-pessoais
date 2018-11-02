import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  template: `
  <ion-content>
    <ion-list>
      <ion-item (click)="adicionarTransacoes()">
        <ion-label>Transação</ion-label>
        <ion-icon name="card" slot="end" color="tertiary"></ion-icon>
      </ion-item>
      <ion-item (click)="adicionarCaixaFinanceiro()">
        <ion-label>Caixa Financeiro</ion-label>
        <ion-icon name="wallet" slot="end" color="tertiary"></ion-icon>
      </ion-item>
    </ion-list>
  </ion-content>
  `,
  styles: []
})
export class MenuComponent {
  constructor(private router: Router, private popoverCtrc: PopoverController) {}

  async adicionarTransacoes() {
    await this.router.navigateByUrl('transacao');
    await this.popoverCtrc.dismiss();
  }

  async adicionarCaixaFinanceiro() {
    await this.router.navigateByUrl('caixa-financeiro');
    await this.popoverCtrc.dismiss();
  }
}
