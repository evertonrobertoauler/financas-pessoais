import { LoginState } from './login.state';
import { CaixaFinanceiroState } from './caixa-financeiro.state';
import { TransacaoState } from './transacao.state';
import { NavegacaoState } from './navegacao.state';

export * from './login.state';
export * from './caixa-financeiro.state';
export * from './transacao.state';
export * from './navegacao.state';

export const STATES = [LoginState, CaixaFinanceiroState, TransacaoState, NavegacaoState];
