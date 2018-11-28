import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoginState, CaixaFinanceiroState, transacao, navegacao, NavegacaoState } from '../../ngxs';
import { Observable } from 'rxjs';
import { Usuario } from '../../interfaces';
import { FILTRO_TODOS_CAIXAS } from '../../servicos';
import { map, delay } from 'rxjs/operators';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  public usuario$: Observable<Usuario>;
  public possuiCaixa$: Observable<boolean>;
  public tab$: Observable<'saldo' | 'extrato'>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.usuario$ = this.store.select(LoginState.usuario);
    this.possuiCaixa$ = this.store.select(CaixaFinanceiroState.possuiCaixasCadastrado);
    this.tab$ = this.store
      .select(NavegacaoState.telaAtual)
      .pipe(delay(500))
      .pipe(map(url => (url.match(/saldo/) ? 'saldo' : 'extrato')));
  }

  async abrir(tela: 'saldo' | 'extrato') {
    if (tela === 'extrato') {
      await this.store
        .dispatch(new transacao.FiltrarPorCaixa({ filtroCaixa: FILTRO_TODOS_CAIXAS }))
        .toPromise();
    }

    const caminho = `/inicio/(tela:${tela})`;
    const nivel = tela === 'saldo' ? 1 : 2;
    const acao = new navegacao.NavegarPara({ caminho, nivel });
    await this.store.dispatch(acao).toPromise();
  }
}
