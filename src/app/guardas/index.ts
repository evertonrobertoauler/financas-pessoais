import { FormulariosGuard } from './formularios.guard';
import { NavegacaoGuard } from './navegacao.guard';

export * from './formularios.guard';
export * from './navegacao.guard';

export const GUARDAS = [FormulariosGuard, NavegacaoGuard];
