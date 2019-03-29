import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { NavegacaoState, Navegacao } from '../ngxs';

export interface FormularioComponent {
  formulario?: FormGroup;
  mudanca?: () => boolean;
  submit: boolean;
}

@Injectable({ providedIn: 'root' })
export class FormulariosGuard implements CanDeactivate<FormularioComponent> {
  constructor(private alertCtrl: AlertController, private store: Store) {}

  async canDeactivate(
    component: FormularioComponent,
    _: any,
    __: any,
    next?: RouterStateSnapshot
  ): Promise<boolean> {
    const telaCorreta = !next || next.url === this.store.selectSnapshot(NavegacaoState.telaAtual);

    if (!telaCorreta) {
      return false;
    }

    const mudanca = component.mudanca
      ? component.mudanca()
      : !component.formulario || component.formulario.touched;

    if (mudanca && !component.submit) {
      const alert = await this.alertCtrl.create({
        header: 'Atenção',
        message: 'Você tem certeza que deseja sair desta tela sem salvar as alterações?',
        buttons: [{ text: 'Não' }, { text: 'Sim', role: 'Sim' }]
      });

      await alert.present();

      component.submit = (await alert.onDidDismiss()).role === 'Sim';

      if (component.submit && next.url) {
        setTimeout(() => {
          if (next.url !== this.store.selectSnapshot(NavegacaoState.telaAtual)) {
            this.store.dispatch(new Navegacao.VoltarParaTelaAnterior());
          }
        }, 100);
      }

      return component.submit;
    }

    return true;
  }
}
