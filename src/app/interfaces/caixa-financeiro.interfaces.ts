import { Timestamp } from '@firebase/firestore-types';

export type TIPO_CAIXA = 'Dinheiro' | 'Cartão Crédito';

export interface CaixaFinanceiro {
  id?: string;
  nome: string;
  tipo: TIPO_CAIXA;
  saldoInicial: number;
  saldoAtual: number;
  diaFatura?: string;
  saldoFuturo: number;
  dataAtualizacao: Timestamp;
}
