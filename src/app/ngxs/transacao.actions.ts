import { Transacao } from '../interfaces';

export class InserirTransacao {
  static readonly type = '[Transação] Inserir Transação]';
  constructor(public payload: Transacao) {}
}

export class ExcluirTransacao {
  static readonly type = '[Transação] Excluir Transação]';
  constructor(public payload: { id: string }) {}
}
