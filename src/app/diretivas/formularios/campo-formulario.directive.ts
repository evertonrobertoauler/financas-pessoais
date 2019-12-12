import { Directive, AfterViewInit, OnDestroy } from '@angular/core';
import { Optional, ElementRef, Renderer2 } from '@angular/core';
import { NgControl, FormControlName } from '@angular/forms';
import { Subscription, merge, fromEvent } from 'rxjs';
import { debounceTime, filter, first } from 'rxjs/operators';
import { FormularioDirective } from './formulario.directive';

@Directive({
  selector: '[appCampoFormulario]'
})
export class CampoFormularioDirective implements AfterViewInit, OnDestroy {
  mudancas: Subscription;
  fecharTeclado: Subscription;

  div: any;

  ERROR_COLOR = '#f53d3dd';

  private campo: HTMLElement;

  constructor(
    private formulario: FormularioDirective,
    private el: ElementRef,
    private renderer: Renderer2,
    @Optional() private ngControl: NgControl
  ) {}

  async ngAfterViewInit() {
    this.campo = this.el.nativeElement;

    if (this.ngControl instanceof FormControlName) {
      this.criarDivErro();

      if (this.campo.nodeName.toLowerCase() === 'ion-input') {
        await fromEvent(this.campo, 'ionInputDidLoad')
          .pipe(debounceTime(300))
          .pipe(first())
          .toPromise();

        this.campo = this.campo.querySelector('input');

        this.fecharTeclado = fromEvent(this.campo, 'keydown')
          .pipe(filter((e: any) => [9, 13].includes(e.keyCode)))
          .pipe(debounceTime(100))
          .subscribe(() => this.formulario.irParaProximoCampo(this.campo));
      }

      this.formulario.registrarCampo(this.campo);

      const mudancas$ = merge(
        fromEvent(this.campo, 'blur').pipe(debounceTime(700)),
        fromEvent(this.campo, 'focus'),
        this.ngControl.statusChanges,
        this.formulario.onSubmit$
      );

      this.mudancas = mudancas$.subscribe(e => {
        const mostrar =
          (this.ngControl.touched ||
            (e instanceof Event && ['blur', 'submit'].indexOf(e.type) !== -1)) &&
          this.campo !== document.activeElement;

        if (mostrar && this.ngControl.control.errors) {
          this.mostrarErro(this.ngControl.control.errors);
        } else {
          this.removerErro();
        }
      });
    } else {
      this.formulario.registrarCampo(this.campo);
    }
  }

  ngOnDestroy() {
    if (this.fecharTeclado instanceof Subscription) {
      this.fecharTeclado.unsubscribe();
    }

    if (this.mudancas instanceof Subscription) {
      this.mudancas.unsubscribe();
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

    if (this.formulario) {
      this.formulario.adicionarErro(this.campo, msg);
    }
  }

  removerErro() {
    this.renderer.setStyle(this.div, 'display', 'none');
    this.renderer.removeStyle(this.el.nativeElement, 'margin-bottom');

    if (this.formulario) {
      this.formulario.removerErro(this.campo);
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
        return `Informe um valor válido para a seguinte expressão regular ${value.requiredPattern}!`;
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
}
