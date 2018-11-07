import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { navegacao, NavegacaoState } from '../../ngxs';

@Component({
  selector: 'app-operacao',
  templateUrl: './operacao.component.html',
  styleUrls: ['./operacao.component.scss']
})
export class OperacaoComponent implements OnInit {
  public tab = '';

  constructor(private store: Store) {}

  ngOnInit() {
    setTimeout(() => this.onTabChange(), 500);
  }

  async navegarPara(tela: 'transacao' | 'transferencia') {
    const caminho = `/operacao/(operacao:${tela})`;
    const acao = new navegacao.NavegarPara({ caminho: caminho, atualizarUrl: false });

    await this.store.dispatch(acao).toPromise();

    this.onTabChange(tela);
  }

  onTabChange(tela = 'transacao') {
    const caminho = `/operacao/(operacao:${tela})`;

    if (this.store.selectSnapshot(NavegacaoState.telaAtual) === caminho) {
      this.tab = tela;
    }
  }
}
