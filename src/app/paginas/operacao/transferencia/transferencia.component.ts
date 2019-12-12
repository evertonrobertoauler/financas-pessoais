import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { FormularioComponent } from '../../../guardas';
import { CamposTransferencia } from '../../../interfaces';
import { FormatarDadosService } from '../../../servicos';
import { CaixaFinanceiroState, transacao, Navegacao, TransacaoState } from '../../../ngxs';
import { diff } from 'deep-object-diff';

@Component({
  selector: 'app-operacao-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.scss']
})
export class OperacaoTransferenciaComponent implements FormularioComponent {
  public formulario = this.formBuilder.group({
    caixaOrigem: [this.store.selectSnapshot(TransacaoState.caixaSelecionado), Validators.required],
    caixaDestino: ['', Validators.required],
    descricao: ['', [Validators.required]],
    valor: ['', [Validators.required]],
    dataTransacao: [this.formatarDados.formatarData(new Date(), 'yyyy-MM-dd'), Validators.required]
  } as CamposTransferencia);

  public submit = false;
  private valorAnterior = this.formulario.getRawValue();

  public caixas$ = this.store.select(CaixaFinanceiroState.caixasFinanceiros);

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private formatarDados: FormatarDadosService
  ) {}

  mudanca() {
    return Object.keys(diff(this.valorAnterior, this.formulario.getRawValue())).length > 0;
  }

  salvar() {
    if (this.formulario.valid) {
      this.submit = true;
      this.store.dispatch(new transacao.SalvarTransferencia(this.formulario.value));
      this.voltar();
    }
  }

  voltar() {
    const caminho = '/inicio/extrato';
    this.store.dispatch(new Navegacao.NavegarPara({ caminho, nivel: 2 }));
  }
}
