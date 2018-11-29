import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, merge, Subscription, EMPTY } from 'rxjs';
import { Transacao, CaixaFinanceiro } from '../../../interfaces';
import { TransacaoState, CaixaFinanceiroState, navegacao, transacao } from '../../../ngxs';
import { map, mapTo, debounceTime, switchMap, tap } from 'rxjs/operators';
import { FormControl, FormBuilder } from '@angular/forms';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-inicio-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.scss']
})
export class InicioExtratoComponent implements OnInit, AfterViewInit, OnDestroy {
  public transacoes$: Observable<Transacao[]>;
  public caixas$: Observable<CaixaFinanceiro[]>;
  public filtroCaixaFinanceiro: FormControl;
  public filtroChange: Subscription;
  public possuiTransacoesAnteriores$: Observable<boolean>;
  public scroll$: Observable<any>;
  public carregando$: Observable<boolean>;

  @ViewChild('scroll') scroll: CdkVirtualScrollViewport;

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

    this.carregando$ = this.store.select(TransacaoState.carregando).pipe(tap(c => console.log(c)));

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

  ngAfterViewInit() {
    this.scroll$ = this.scroll.scrolledIndexChange
      .pipe(debounceTime(500))
      .pipe(map(_ => this.scroll.measureScrollOffset('bottom')))
      .pipe(switchMap(pb => (pb < 300 ? this.carregarTransacoesAnteriores() : EMPTY)));
  }

  ngOnDestroy() {
    if (this.filtroChange instanceof Subscription) {
      this.filtroChange.unsubscribe();
    }
  }

  trackByFn(_, item: Transacao) {
    return item.id;
  }

  editarTransacao(trans: Transacao) {
    const caminho = `/transacao/${trans.id}`;
    this.store.dispatch(new navegacao.NavegarPara({ caminho }));
  }

  adicionarOperacao() {
    const caminho = '/operacao/(operacao:transacao)';
    this.store.dispatch(new navegacao.NavegarPara({ caminho }));
  }

  async carregarTransacoesAnteriores() {
    console.log('carregarTransacoesAnteriores');
    await this.store.dispatch(new transacao.CarregarMaisTransacoes()).toPromise();
  }
}
