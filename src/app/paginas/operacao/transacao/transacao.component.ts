import { Component, OnInit } from '@angular/core';
import { FormularioComponent } from '../../../guardas';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AlertController } from '@ionic/angular';
import { CamposTransacao, TIPO_TRANSACAO } from '../../../interfaces';
import { transacao, CaixaFinanceiroState, TransacaoState, Navegacao } from '../../../ngxs';
import { TIPOS_TRANSACAO, FormatarDadosService } from '../../../servicos';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap, first } from 'rxjs/operators';
import { diff } from 'deep-object-diff';

@Component({
  selector: 'app-operacao-transacao',
  templateUrl: './transacao.component.html',
  styleUrls: ['./transacao.component.scss']
})
export class OperacaoTransacaoComponent implements OnInit, FormularioComponent {
  formulario = this.formBuilder.group({
    id: [],
    dataCadastro: [],
    caixaFinanceiro: [
      this.store.selectSnapshot(TransacaoState.caixaSelecionado),
      Validators.required
    ],
    tipo: ['Despesa' as TIPO_TRANSACAO, Validators.required],
    descricao: ['', Validators.required],
    valor: ['', [Validators.required]],
    dataTransacao: [this.formatarDados.formatarData(new Date(), 'YYYY-MM-DD'), Validators.required]
  } as CamposTransacao);

  submit: boolean;

  private valorAnterior = this.formulario.getRawValue();

  public id: string;

  public tipos = TIPOS_TRANSACAO;
  public caixas$ = this.store.select(CaixaFinanceiroState.caixasFinanceiros);

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private alertCtrl: AlertController,
    private formatarDados: FormatarDadosService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const regTransacao = await this.route.params
      .pipe(filter(p => p && p.id))
      .pipe(switchMap(p => this.store.select(TransacaoState.transacao(p.id))))
      .pipe(filter(cx => !!cx))
      .pipe(first())
      .toPromise();

    this.id = regTransacao.id;

    this.formulario.patchValue(regTransacao);
    this.valorAnterior = this.formulario.getRawValue();
  }

  mudanca() {
    return Object.keys(diff(this.valorAnterior, this.formulario.getRawValue())).length > 0;
  }

  salvar() {
    if (this.formulario.valid) {
      this.submit = true;
      this.store.dispatch(new transacao.SalvarTransacao(this.formulario.value));
      this.voltar();
    }
  }

  async excluir() {
    const alert = await this.alertCtrl.create({
      header: 'Atenção',
      message: 'Você tem certeza que deseja excluir esta transação?',
      buttons: [{ text: 'Não' }, { text: 'Sim', role: 'Sim' }]
    });

    await alert.present();

    if ((await alert.onDidDismiss()).role === 'Sim') {
      this.submit = true;
      this.store.dispatch(new transacao.ExcluirTransacao({ id: this.id }));
      this.voltar();
    }
  }

  voltar() {
    const caminho = '/inicio/extrato';
    this.store.dispatch(new Navegacao.NavegarPara({ caminho, nivel: 2 }));
  }
}
