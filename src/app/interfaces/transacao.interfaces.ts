import { Timestamp } from '@firebase/firestore-types';

export type TIPO_TRANSACAO = 'Receita' | 'Despesa';

export interface Transacao {
  id?: string;
  caixaFinanceiro: string;
  tipo: TIPO_TRANSACAO;
  valor: number;
  dataCadastro: Timestamp;
  dataTransacao: Timestamp;
  descricao: string;
}
