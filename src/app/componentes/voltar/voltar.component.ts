import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NavegacaoState, Navegacao } from '../../ngxs';

@Component({
  selector: 'app-voltar',
  template: `
    <ion-button *ngIf="podeVoltar$ | async" color="light" (click)="voltar()">
      <ion-icon slot="icon-only" name="arrow-round-back"></ion-icon>
    </ion-button>
  `,
  styles: []
})
export class VoltarComponent implements OnInit {
  podeVoltar$: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.podeVoltar$ = this.store.select(NavegacaoState.podeVoltar);
  }

  voltar() {
    this.store.dispatch(new Navegacao.VoltarParaTelaAnterior());
  }
}
