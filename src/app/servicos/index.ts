import { FirebaseService } from './firebase.service';
import { UsuarioService } from './usuario.service';
import { CaixaFinanceiroService } from './caixa-financeiro.service';
import { TransacaoService } from './transacao.service';
import { FormatarDadosService } from './formatar-dados.service';

export * from './firebase.service';
export * from './usuario.service';
export * from './caixa-financeiro.service';
export * from './transacao.service';
export * from './formatar-dados.service';

export const SERVICOS = [
  FirebaseService,
  UsuarioService,
  CaixaFinanceiroService,
  TransacaoService,
  FormatarDadosService
];
