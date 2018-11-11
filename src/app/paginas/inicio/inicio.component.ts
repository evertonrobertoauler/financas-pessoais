import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoginState, CaixaFinanceiroState, transacao, navegacao } from '../../ngxs';
import { Observable } from 'rxjs';
import { Usuario } from '../../interfaces';
import { FILTRO_TODOS_CAIXAS } from '../../servicos';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  public usuario$: Observable<Usuario>;
  public possuiCaixa$: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.usuario$ = this.store.select(LoginState.usuario);
    this.possuiCaixa$ = this.store.select(CaixaFinanceiroState.possuiCaixasCadastrado);
  }

  abrirExtrato() {
    this.store.dispatch(new transacao.FiltrarPorCaixa({ filtroCaixa: FILTRO_TODOS_CAIXAS }));
    this.store.dispatch(new navegacao.NavegarPara({ caminho: '/inicio/(extrato:extrato)' }));
  }
}
