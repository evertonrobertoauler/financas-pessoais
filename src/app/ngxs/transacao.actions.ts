import { Transacao, Transferencia } from '../interfaces';

export class SalvarTransacao {
  static readonly type = '[Transação] Salvar Transação]';
  constructor(public payload: Transacao) {}
}

export class SalvarTransferencia {
  static readonly type = '[Transação] Salvar Transferência]';
  constructor(public payload: Transferencia) {}
}

export class ExcluirTransacao {
  static readonly type = '[Transação] Excluir Transação]';
  constructor(public payload: { id: string }) {}
}

export class FiltrarPorCaixa {
  static readonly type = '[Transação] Filtrar Transações p/ Caixa]';
  constructor(public payload: { filtroCaixa: string }) {}
}

export class CarregarMaisTransacoes {
  static readonly type = '[Transação] Carregar mais Transações]';
}
