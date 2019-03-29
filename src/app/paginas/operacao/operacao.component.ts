import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Navegacao, NavegacaoState } from '../../ngxs';

@Component({
  selector: 'app-operacao',
  templateUrl: './operacao.component.html',
  styleUrls: ['./operacao.component.scss']
})
export class OperacaoComponent implements OnInit {
  private nivel: number;

  constructor(private store: Store) {}

  ngOnInit() {
    this.nivel = this.store.selectSnapshot(NavegacaoState.historico).size;
  }

  async navegarPara(tela: 'transacao' | 'transferencia') {
    const caminho = `/operacao/${tela}`;
    const nivel = this.nivel + (tela === 'transacao' ? 0 : 1);
    const acao = new Navegacao.NavegarPara({ caminho, nivel });
    await this.store.dispatch(acao).toPromise();
  }
}
