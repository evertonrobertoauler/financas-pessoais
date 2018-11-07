import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subscription, fromEvent, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Erro {
  msg: string;
  campo: HTMLElement;
  index: number;
}

@Directive({
  selector: '[appFormulario]'
})
export class FormularioDirective implements OnInit, OnDestroy {
  public onSubmit$: Observable<any>;

  private submitSubscription: Subscription;
  private erros: { [path: string]: Erro } = {};

  private campos: HTMLElement[] = [];

  constructor(private element: ElementRef, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.onSubmit$ = fromEvent(this.element.nativeElement, 'submit');
    this.submitSubscription = this.onSubmit$.pipe(delay(100)).subscribe(() => this.mostrarErro());
  }

  ngOnDestroy() {
    if (this.submitSubscription instanceof Subscription) {
      this.submitSubscription.unsubscribe();
    }
  }

  registrarCampo(campo: HTMLElement) {
    this.campos = [...this.campos, campo];
  }

  irParaProximoCampo(campo: HTMLElement) {
    const index = this.campos.indexOf(campo);
    const proximoCampo = this.campos[index + 1];

    if (proximoCampo) {
      if ('setFocus' in proximoCampo) {
        (proximoCampo as any).setFocus();
      } else {
        proximoCampo.tabIndex = index + 1;
        proximoCampo.focus();
      }
    } else {
      campo.blur();
    }
  }

  adicionarErro(campo: HTMLElement, msg: string) {
    const index = this.campos.indexOf(campo);
    this.erros[index] = { msg, campo, index };
  }

  removerErro(campo: HTMLElement) {
    delete this.erros[this.campos.indexOf(campo)];
  }

  private async mostrarErro() {
    const erro = Object.keys(this.erros)
      .map(k => this.erros[k])
      .reduce((o, v) => (o.index === -1 || o.index > v.index ? v : o), {
        index: -1,
        msg: '',
        campo: null
      });

    if (erro.index !== -1) {
      erro.campo.tabIndex = erro.index + 1;
      erro.campo.focus();

      const toast = await this.toastCtrl.create({
        message: erro.msg,
        duration: 3000,
        position: 'bottom'
      });

      await toast.present();
    }
  }
}
