import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CamposCaixaFinanceiro, TIPO_CAIXA } from '../../interfaces';
import { TIPOS_CAIXA } from '../../servicos';
import { FormularioComponent } from '../../guardas';
import { ActivatedRoute } from '@angular/router';
import { first, map, tap, filter, switchMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { CaixaFinanceiroState, caixaFinanceiro, Navegacao } from '../../ngxs';
import { AlertController } from '@ionic/angular';
import { diff } from 'deep-object-diff';

@Component({
  selector: 'app-caixa-financeiro',
  templateUrl: './caixa-financeiro.component.html',
  styleUrls: ['./caixa-financeiro.component.scss']
})
export class CaixaFinanceiroComponent implements OnInit, FormularioComponent {
  public submit = false;
  public formulario = this.formBuilder.group({
    id: [],
    nome: ['', Validators.required],
    tipo: ['', Validators.required],
    diaFechamentoFatura: []
  } as CamposCaixaFinanceiro);

  public tipos: TIPO_CAIXA[];

  public id: string;

  public cartao$ = this.formulario
    .get('tipo')
    .valueChanges.pipe(map((tipo: TIPO_CAIXA) => tipo === 'Cartão Crédito'))
    .pipe(tap(cartao => this.regrasCartao(cartao)));

  private valorAnterior = this.formulario.getRawValue();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private alertCtrl: AlertController,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.tipos = TIPOS_CAIXA;

    const caixa = await this.route.params
      .pipe(filter(p => p && p.id))
      .pipe(switchMap(p => this.store.select(CaixaFinanceiroState.caixaFinanceiro(p.id))))
      .pipe(filter(cx => !!cx))
      .pipe(first())
      .toPromise();

    this.id = caixa.id;

    this.formulario.patchValue(caixa);

    if (caixa.id) {
      this.formulario.get('tipo').disable();
      this.formulario.get('diaFechamentoFatura').disable();
    }

    this.valorAnterior = this.formulario.getRawValue();
  }

  mudanca() {
    return Object.keys(diff(this.valorAnterior, this.formulario.getRawValue())).length > 0;
  }

  salvar() {
    if (this.formulario.valid) {
      this.submit = true;

      if (this.mudanca()) {
        const acao = new caixaFinanceiro.SalvarCaixaFinanceiro(this.formulario.getRawValue());
        this.store.dispatch(acao);
      }

      this.voltar();
    }
  }

  async excluir() {
    const alert = await this.alertCtrl.create({
      header: 'Atenção',
      message: 'Você tem certeza que deseja excluir este caixa financeiro?',
      buttons: [{ text: 'Não' }, { text: 'Sim', role: 'Sim' }]
    });

    await alert.present();

    if ((await alert.onDidDismiss()).role === 'Sim') {
      this.submit = true;
      this.store.dispatch(new caixaFinanceiro.ExcluirCaixaFinanceiro({ id: this.id }));
      this.voltar();
    }
  }

  voltar() {
    this.store.dispatch(new Navegacao.VoltarParaTelaAnterior());
  }

  private regrasCartao(cartao: boolean) {
    const diaFechamentoFatura = this.formulario.get('diaFechamentoFatura');

    if (cartao) {
      diaFechamentoFatura.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(31)
      ]);
    } else {
      diaFechamentoFatura.clearValidators();
      diaFechamentoFatura.setValue(null);
    }

    diaFechamentoFatura.updateValueAndValidity();
  }
}
