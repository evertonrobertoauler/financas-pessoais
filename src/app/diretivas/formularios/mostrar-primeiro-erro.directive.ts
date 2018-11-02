import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { delay } from 'rxjs/operators';

interface Erro {
  top: number;
  msg: string;
  element?: HTMLElement;
}

@Directive({
  selector: '[appMostrarPrimeiroErro]'
})
export class MostrarPrimeiroErroDirective implements OnInit, OnDestroy {
  private submitSubscription: Subscription;

  private erros: { [path: string]: Erro } = {};

  constructor(private element: ElementRef, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.submitSubscription = fromEvent(this.element.nativeElement, 'submit')
      .pipe(delay(100))
      .subscribe(() => this.mostrarErro());
  }

  ngOnDestroy() {
    if (this.submitSubscription instanceof Subscription) {
      this.submitSubscription.unsubscribe();
    }
  }

  adicionar(path: string[], element: HTMLElement, msg: string) {
    const top = element.getBoundingClientRect().top;
    element.tabIndex = top;
    this.erros[path.join('.')] = { top: element.getBoundingClientRect().top, msg, element };
  }

  remover(path: string[]) {
    delete this.erros[path.join('.')];
  }

  private async mostrarErro() {
    const erro = Object.keys(this.erros)
      .map(k => this.erros[k])
      .reduce((o, v) => (o.top === -1 || o.top > v.top ? v : o), { top: -1, msg: '' });

    if (erro.top !== -1) {
      erro.element.focus();

      const toast = await this.toastCtrl.create({
        message: erro.msg,
        duration: 3000,
        position: 'bottom'
      });

      await toast.present();
    }
  }
}
