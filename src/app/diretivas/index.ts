import { FormularioDirective } from './formularios/formulario.directive';
import { CampoFormularioDirective } from './formularios/campo-formulario.directive';
import { MascaraDirective } from './formularios/mascara.directive';

export * from './formularios/formulario.directive';
export * from './formularios/campo-formulario.directive';
export * from './formularios/mascara.directive';

export const DIRETIVAS = [FormularioDirective, CampoFormularioDirective, MascaraDirective];
