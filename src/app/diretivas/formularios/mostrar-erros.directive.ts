import { Directive, AfterViewInit, OnDestroy, Optional } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';
import { Subscription, merge, fromEvent } from 'rxjs';
import { NgControl, FormArrayName, FormControlName } from '@angular/forms';
import { MostrarPrimeiroErroDirective } from './mostrar-primeiro-erro.directive';

@Directive({
  selector: '[appMostrarErros]'
})
export class MostrarErrosDirective implements AfterViewInit, OnDestroy {
  changes: Subscription;

  div: any;

  ERROR_COLOR = '#f53d3dd';

  constructor(
    @Optional() private ngControl: NgControl,
    @Optional() private ngArrayControl: FormArrayName,
    @Optional() private mostrarPrimeiroErro: MostrarPrimeiroErroDirective,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    if (this.ngControl instanceof FormControlName) {
      this.criarDivErro();

      const element = this.el.nativeElement;

      const changes$ = merge(
        fromEvent(element, 'blur'),
        fromEvent(element, 'focus'),
        this.ngControl.statusChanges,
        fromEvent(this.obterForm(element), 'submit')
      );

      this.changes = changes$.subscribe(e => {
        const mostrar =
          (this.ngControl.touched ||
            (e instanceof Event && ['blur', 'submit'].indexOf(e.type) !== -1)) &&
          element !== document.activeElement;

        if (mostrar && this.ngControl.control.errors) {
          this.mostrarErro(this.ngControl.control.errors);
        } else {
          this.removerErro();
        }
      });
    } else if (this.ngArrayControl instanceof FormArrayName) {
      this.criarDivErro();

      const changes$ = merge(
        this.ngArrayControl.statusChanges,
        this.ngArrayControl.formDirective.ngSubmit
      );

      this.changes = changes$.subscribe(e => {
        const mostrar = this.ngArrayControl.touched || (e instanceof Event && e.type === 'submit');

        if (mostrar && this.ngArrayControl.control.errors) {
          this.mostrarErro(this.ngArrayControl.control.errors);
        } else {
          this.removerErro();
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.changes instanceof Subscription) {
      this.changes.unsubscribe();
    }
  }

  criarDivErro() {
    this.div = this.renderer.createElement('div');
    this.renderer.setAttribute(this.div, 'class', 'mostrar-erro');
    this.renderer.appendChild(this.el.nativeElement.parentElement, this.div);
  }

  mostrarErro(errors: any) {
    const msg = this.formatObjToMsg(errors);

    this.renderer.setStyle(this.div, 'display', 'block');
    this.renderer.setProperty(this.div, 'textContent', msg);
    this.renderer.setStyle(this.el.nativeElement, 'margin-bottom', '0');

    if (this.mostrarPrimeiroErro) {
      this.mostrarPrimeiroErro.adicionar(this.obterPath(), this.el.nativeElement, msg);
    }
  }

  removerErro() {
    this.renderer.setStyle(this.div, 'display', 'none');
    this.renderer.removeStyle(this.el.nativeElement, 'margin-bottom');

    if (this.mostrarPrimeiroErro) {
      this.mostrarPrimeiroErro.remover(this.obterPath());
    }
  }

  formatObjToMsg(obj: Object): string {
    return Object.keys(obj)
      .map(key => this.formatMsg(key, obj[key]))
      .join('\n');
  }

  formatMsg(key, value) {
    switch (key) {
      case 'required':
        return 'Campo Obrigatório!';
      case 'obrigatorio':
        return 'Campo Obrigatório, espaços em branco não são considerados!';
      case 'minlength':
        return `Informe no mínimo ${value.requiredLength} caractéres!`;
      case 'maxlength':
        return `Informe no máximo ${value.requiredLength} caractéres!`;
      case 'min':
        return `Informe um número maior ou igual a ${value.min}!`;
      case 'max':
        return `Informe um número menor ou igual a ${value.max}!`;
      case 'pattern':
        return `Informe um valor válido para a seguinte expressão regular ${
          value.requiredPattern
        }!`;
      case 'email':
        return 'E-mail inválido!';
      case 'cpf':
        return 'CPF inválido!';
      case 'telefone':
        return 'Telefone incompleto!';
      case 'celular':
        return 'Celular incompleto, não esqueça do DDD e do nono dígito!';
      case 'senhasIguais':
        return 'Senhas diferentes!';
      default:
        return 'Valor inválido!';
    }
  }

  obterPath(): string[] {
    return this.ngControl
      ? this.ngControl.path
      : this.ngArrayControl
        ? this.ngArrayControl.path
        : [];
  }

  obterForm(element: HTMLElement): HTMLFormElement | undefined {
    while (element.parentElement) {
      if (element.parentElement.tagName.toLowerCase() === 'form') {
        return element.parentElement as HTMLFormElement;
      }

      element = element.parentElement;
    }
  }
}
