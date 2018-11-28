import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { navegacao, NavegacaoState } from '../../ngxs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Component({
  selector: 'app-operacao',
  templateUrl: './operacao.component.html',
  styleUrls: ['./operacao.component.scss']
})
export class OperacaoComponent implements OnInit {
  public tab$: Observable<'transacao' | 'transferencia'>;

  private nivel: number;

  constructor(private store: Store) {}

  ngOnInit() {
    this.nivel = this.store.selectSnapshot(NavegacaoState.historico).size;

    this.tab$ = this.store
      .select(NavegacaoState.telaAtual)
      .pipe(delay(300))
      .pipe(map(url => (url.match(/transacao/) ? 'transacao' : 'transferencia')));
  }

  async navegarPara(tela: 'transacao' | 'transferencia') {
    const caminho = `/operacao/(operacao:${tela})`;
    const nivel = this.nivel + (tela === 'transacao' ? 0 : 1);
    const acao = new navegacao.NavegarPara({ caminho, nivel });
    await this.store.dispatch(acao).toPromise();
  }
}
