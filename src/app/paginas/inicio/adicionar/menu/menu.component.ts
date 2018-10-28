import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  template: `
  <ion-content>
    <ion-list>
      <ion-item (click)="adicionarTransacoes()">
        <ion-label>Transações</ion-label>
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
  constructor() {}

  adicionarTransacoes() {
    console.log('adicionarTransacoes');
  }

  adicionarCaixaFinanceiro() {
    console.log('adicionarCaixaFinanceiro');
  }
}
