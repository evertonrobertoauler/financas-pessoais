import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { AlertController } from '@ionic/angular';

export interface FormularioComponent {
  formulario: FormGroup;
  submit: boolean;
}

@Injectable({ providedIn: 'root' })
export class FormulariosGuard implements CanDeactivate<FormularioComponent> {
  constructor(private alertCtrl: AlertController) {}

  async canDeactivate(component: FormularioComponent): Promise<boolean> {
    if (component.formulario.touched && !component.submit) {
      const alert = await this.alertCtrl.create({
        header: 'Atenção',
        message: 'Você tem certeza que deseja sair esta tela sem salvar as alterações?',
        buttons: [{ text: 'Não' }, { text: 'Sim', role: 'Sim' }]
      });

      await alert.present();

      return (await alert.onDidDismiss()).role === 'Sim';
    } else {
      return true;
    }
  }
}
