import { CaixaFinanceiro } from '../interfaces';

export class SalvarCaixaFinanceiro {
  static readonly type = '[Caixa Financeiro] Salvar caixa]';
  constructor(public payload: CaixaFinanceiro) {}
}

export class ExcluirCaixaFinanceiro {
  static readonly type = '[Caixa Financeiro] Excluir caixa]';
  constructor(public payload: { id: string }) {}
}

export class RecalcularSaldoParcial {
  static readonly type = '[Caixa Financeiro] Recalcular saldo parcial]';
}

export class RecalcularSaldoTotal {
  static readonly type = '[Caixa Financeiro] Recalcular saldo total]';
}
