import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CaixaFinanceiroState } from '../../../ngxs';
import { CaixaFinanceiro } from '../../../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.scss']
})
export class InicioSaldoComponent implements OnInit {
  public saldoAtual$: Observable<number>;
  public saldoFuturo$: Observable<number>;
  public caixasFinanceiros$: Observable<CaixaFinanceiro[]>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.saldoAtual$ = this.store.select(CaixaFinanceiroState.saldoAtual);
    this.saldoFuturo$ = this.store.select(CaixaFinanceiroState.saldoFuturo);
    this.caixasFinanceiros$ = this.store.select(CaixaFinanceiroState.caixasFinanceiros);
  }

  editarCaixa(caixa: CaixaFinanceiro) {
    this.router.navigate(['caixa-financeiro', caixa.id]);
  }
}
