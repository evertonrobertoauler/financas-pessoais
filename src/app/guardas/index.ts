import { FormulariosGuard } from './formularios.guard';
import { LoginGuard } from './login.guard';

export * from './formularios.guard';
export * from './login.guard';

export const GUARDAS = [FormulariosGuard, LoginGuard];
