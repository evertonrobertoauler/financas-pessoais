import { Component, OnInit } from '@angular/core';
import { FormularioComponent } from '../../guardas';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AlertController } from '@ionic/angular';
import { CaixaFinanceiro, CamposTransacao, TIPO_TRANSACAO } from '../../interfaces';
import { transacao, CaixaFinanceiroState, TransacaoState, navegacao } from '../../ngxs';
import { Observable } from 'rxjs';
import { TIPOS_TRANSACAO, FormatarDadosService } from '../../servicos';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap, first } from 'rxjs/operators';

@Component({
  selector: 'app-transacao',
  templateUrl: './transacao.component.html',
  styleUrls: ['./transacao.component.scss']
})
export class TransacaoComponent implements OnInit, FormularioComponent {
  formulario: FormGroup;
  submit: boolean;

  public id: string;

  public tipos = TIPOS_TRANSACAO;
  public caixas$: Observable<CaixaFinanceiro[]>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private alertCtrl: AlertController,
    private formatarDados: FormatarDadosService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const dataAtual = this.formatarDados.formatarData(new Date(), 'YYYY-MM-DD');

    this.formulario = this.formBuilder.group({
      id: [],
      dataCadastro: [],
      caixaFinanceiro: ['', Validators.required],
      tipo: ['Despesa' as TIPO_TRANSACAO, Validators.required],
      dataTransacao: [dataAtual, Validators.required],
      valor: ['', [Validators.required]],
      descricao: ['', Validators.required]
    } as CamposTransacao);

    this.caixas$ = this.store.select(CaixaFinanceiroState.caixasFinanceiros);

    const regTransacao = await this.route.params
      .pipe(filter(p => p && p.id))
      .pipe(switchMap(p => this.store.select(TransacaoState.transacao(p.id))))
      .pipe(filter(cx => !!cx))
      .pipe(first())
      .toPromise();

    this.id = regTransacao.id;

    this.formulario.patchValue(regTransacao);
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
    this.store.dispatch(new navegacao.VoltarParaTelaAnterior());
  }
}
