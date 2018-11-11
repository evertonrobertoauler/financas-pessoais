import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, merge, Subscription } from 'rxjs';
import { Transacao, CaixaFinanceiro } from '../../../interfaces';
import { TransacaoState, CaixaFinanceiroState, navegacao, transacao } from '../../../ngxs';
import { map, mapTo } from 'rxjs/operators';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-inicio-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.scss']
})
export class InicioExtratoComponent implements OnInit, OnDestroy {
  public transacoes$: Observable<Transacao[]>;
  public caixas$: Observable<CaixaFinanceiro[]>;
  public filtroCaixaFinanceiro: FormControl;
  public filtroChange: Subscription;
  public possuiTransacoesAnteriores$: Observable<boolean>;

  constructor(private store: Store, private formBuilder: FormBuilder) {}

  ngOnInit() {
    const caixaFinanceiro = id => this.store.select(CaixaFinanceiroState.caixaFinanceiro(id));

    const transacaoFn = (trans: Transacao) => ({
      ...trans,
      caixaFinanceiro$: caixaFinanceiro(trans.caixaFinanceiro)
    });

    this.transacoes$ = this.store
      .select(TransacaoState.transacoes)
      .pipe(map(list => list.map(t => transacaoFn(t))));

    this.caixas$ = this.store.select(CaixaFinanceiroState.caixasFinanceiros);

    this.possuiTransacoesAnteriores$ = this.store.select(TransacaoState.possuiTransacoesAnteriores);

    this.filtroCaixaFinanceiro = this.formBuilder.control(null);

    const filtro$ = this.filtroCaixaFinanceiro.valueChanges.pipe(mapTo('filtro'));
    const store$ = this.store.select(TransacaoState.filtroCaixa).pipe(mapTo('store'));

    this.filtroChange = merge(filtro$, store$).subscribe(tipo => {
      const campo = this.filtroCaixaFinanceiro.value;
      const store = this.store.selectSnapshot(TransacaoState.filtroCaixa);

      if (campo === store) {
        return null;
      } else if (tipo === 'filtro') {
        this.store.dispatch(new transacao.FiltrarPorCaixa({ filtroCaixa: campo }));
      } else if (tipo === 'store') {
        this.filtroCaixaFinanceiro.setValue(store);
      }
    });
  }

  ngOnDestroy() {
    if (this.filtroChange instanceof Subscription) {
      this.filtroChange.unsubscribe();
    }
  }

  editarTransacao(trans: Transacao) {
    this.store.dispatch(new navegacao.NavegarPara({ caminho: ['transacao', trans.id] }));
  }

  adicionarOperacao() {
    this.store.dispatch(new navegacao.NavegarPara({ caminho: '/operacao/(operacao:transacao)' }));
  }

  async carregarTransacoesAnteriores($event) {
    await this.store.dispatch(new transacao.CarregarMaisTransacoes()).toPromise();
    $event.target.complete();
  }
}
