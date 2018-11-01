import { Timestamp } from '@firebase/firestore-types';

export interface Usuario {
  id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  foto: string | null;
  ultimoAcesso: Timestamp;
}
