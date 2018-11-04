import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CamposCaixaFinanceiro, TIPO_CAIXA } from '../../interfaces';
import { TIPOS_CAIXA } from '../../servicos';
import { FormularioComponent } from '../../guardas';
import { ActivatedRoute, Router } from '@angular/router';
import { first, map, tap, filter, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { CaixaFinanceiroState, caixaFinanceiro } from '../../ngxs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-caixa-financeiro',
  templateUrl: './caixa-financeiro.component.html',
  styleUrls: ['./caixa-financeiro.component.scss']
})
export class CaixaFinanceiroComponent implements OnInit, FormularioComponent {
  public submit = false;
  public formulario: FormGroup;

  public tipos: TIPO_CAIXA[];

  public id: string;

  public cartao$: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.tipos = TIPOS_CAIXA;

    this.formulario = this.formBuilder.group({
      id: [],
      nome: ['', Validators.required],
      tipo: ['', Validators.required],
      diaFatura: []
    } as CamposCaixaFinanceiro);

    this.cartao$ = this.formulario
      .get('tipo')
      .valueChanges.pipe(map((tipo: TIPO_CAIXA) => tipo === 'Cartão Crédito'))
      .pipe(tap(cartao => this.regrasCartao(cartao)));

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
      this.formulario.get('diaFatura').disable();
    }
  }

  salvar() {
    if (this.formulario.valid) {
      this.submit = true;
      this.store.dispatch(new caixaFinanceiro.SalvarCaixaFinanceiro(this.formulario.value));
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
    this.router.navigateByUrl('/inicio/(saldo:saldo)');
  }

  private regrasCartao(cartao: boolean) {
    const diaFatura = this.formulario.get('diaFatura');

    if (cartao) {
      diaFatura.setValidators([Validators.required, Validators.min(1), Validators.max(31)]);
    } else {
      diaFatura.clearValidators();
      diaFatura.setValue(null);
    }

    diaFatura.updateValueAndValidity();
  }
}
