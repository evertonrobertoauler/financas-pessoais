import { Timestamp } from '@firebase/firestore-types';
import { Observable } from 'rxjs';
import { CaixaFinanceiro } from './caixa-financeiro.interfaces';

export type TIPO_TRANSACAO = 'Receita' | 'Despesa';

export interface Transacao {
  id?: string;
  dataCadastro: Timestamp;
  caixaFinanceiro: string;
  caixaFinanceiro$?: Observable<CaixaFinanceiro>;
  tipo: TIPO_TRANSACAO;
  valor: number;
  dataTransacao: string;
  descricao: string;
}

export type CamposTransacao = { [k in keyof Transacao]: any };
