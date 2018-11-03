import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Transacao } from '../../../interfaces';
import { TransacaoState, CaixaFinanceiroState } from '../../../ngxs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-inicio-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.scss']
})
export class InicioExtratoComponent implements OnInit {
  public transacoes$: Observable<Transacao[]>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    const caixaFinanceiro = id => this.store.select(CaixaFinanceiroState.caixaFinanceiro(id));

    const transacaoFn = (trans: Transacao) => ({
      ...trans,
      caixaFinanceiro$: caixaFinanceiro(trans.caixaFinanceiro)
    });

    this.transacoes$ = this.store
      .select(TransacaoState.transacoes)
      .pipe(map(list => list.map(t => transacaoFn(t))));
  }

  editarTransacao(transacao: Transacao) {
    this.router.navigate(['transacao', transacao.id]);
  }
}
