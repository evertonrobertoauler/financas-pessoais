import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-adicionar',
  template: `
    <ion-fab-button (click)="mostrarMenu($event)" color="secondary">
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  `,
  styles: []
})
export class AdicionarComponent {
  constructor(private popoverCtrl: PopoverController) {}

  async mostrarMenu($event) {
    const popover = await this.popoverCtrl.create({
      component: MenuComponent,
      event: $event
    });

    return await popover.present();
  }
}
