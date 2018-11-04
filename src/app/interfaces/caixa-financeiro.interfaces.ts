import { Timestamp } from '@firebase/firestore-types';

export type TIPO_CAIXA = 'Carteira' | 'Cartão Crédito';

export interface CaixaFinanceiro {
  id?: string;
  nome: string;
  tipo: TIPO_CAIXA;
  diaFechamentoFatura?: number;
  saldoAtual: number;
  saldoFuturo: number;
  dataAtualizacao: Timestamp;
}

export type CamposCaixaFinanceiro = { [k in keyof CaixaFinanceiro]?: any };
