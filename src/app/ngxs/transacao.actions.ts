import { Transacao } from '../interfaces';

export class SalvarTransacao {
  static readonly type = '[Transação] Salvar Transação]';
  constructor(public payload: Transacao) {}
}

export class ExcluirTransacao {
  static readonly type = '[Transação] Excluir Transação]';
  constructor(public payload: { id: string }) {}
}
