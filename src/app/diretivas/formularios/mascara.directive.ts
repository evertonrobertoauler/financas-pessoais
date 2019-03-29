import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { FormatarDadosService } from '../../servicos';
import { Subscription, combineLatest, of } from 'rxjs';
import { NgControl } from '@angular/forms';
import { IonInput } from '@ionic/angular';

@Directive({
  selector: '[appMascara]'
})
export class MascaraDirective implements OnInit, OnDestroy {
  @Input()
  appMascara: 'valor';

  private changes: Subscription;

  constructor(
    private control: NgControl,
    private input: IonInput,
    private formatarDados: FormatarDadosService
  ) {}

  ngOnInit() {
    this.changes = combineLatest(of(null), this.control.valueChanges).subscribe(() => {
      const valor = this.control.value;
      const formatado = this.formatarDados.formatarValor(valor);

      if (valor !== formatado) {
        this.input.value = formatado;
      }
    });
  }

  ngOnDestroy() {
    if (this.changes instanceof Subscription) {
      this.changes.unsubscribe();
    }
  }
}
