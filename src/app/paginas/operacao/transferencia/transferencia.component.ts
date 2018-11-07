import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { FormularioComponent } from '../../../guardas';
import { CaixaFinanceiro, CamposTransferencia } from '../../../interfaces';
import { FormatarDadosService } from '../../../servicos';
import { CaixaFinanceiroState, transacao, navegacao } from '../../../ngxs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-operacao-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.scss']
})
export class OperacaoTransferenciaComponent implements OnInit, FormularioComponent {
  public formulario: FormGroup;
  public submit = false;

  public caixas$: Observable<CaixaFinanceiro[]>;
  public descricao$: Observable<any>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private formatarDados: FormatarDadosService
  ) {}

  async ngOnInit() {
    const dataAtual = this.formatarDados.formatarData(new Date(), 'YYYY-MM-DD');

    this.formulario = this.formBuilder.group({
      caixaOrigem: ['', Validators.required],
      caixaDestino: ['', Validators.required],
      descricao: ['', [Validators.required]],
      valor: ['', [Validators.required]],
      dataTransacao: [dataAtual, Validators.required]
    } as CamposTransferencia);

    this.caixas$ = this.store.select(CaixaFinanceiroState.caixasFinanceiros);

    const origem$ = this.formulario.get('caixaOrigem').valueChanges;
    const destino$ = this.formulario.get('caixaDestino').valueChanges;

    const fnCaixa = id => {
      const caixa = this.store.selectSnapshot(CaixaFinanceiroState.caixaFinanceiro(id));
      return `${caixa.nome} (${caixa.tipo})`;
    };

    this.descricao$ = combineLatest(origem$, destino$).pipe(
      tap(([origem, destino]) => {
        if (origem && destino) {
          this.formulario.get('descricao').setValue(`${fnCaixa(origem)} -> ${fnCaixa(destino)}`);
        }
      })
    );
  }

  salvar() {
    if (this.formulario.valid) {
      this.submit = true;
      this.store.dispatch(new transacao.SalvarTransferencia(this.formulario.value));
      this.voltar();
    }
  }

  voltar() {
    this.store.dispatch(new navegacao.VoltarParaTelaAnterior());
  }
}
