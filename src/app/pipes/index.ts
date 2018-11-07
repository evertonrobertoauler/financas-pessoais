import { FormatarDataPipe } from './formatar-data.pipe';
import { FormatarValorPipe } from './formatar-valor.pipe';

export * from './formatar-data.pipe';
export * from './formatar-valor.pipe';

export const PIPES = [FormatarDataPipe, FormatarValorPipe];
