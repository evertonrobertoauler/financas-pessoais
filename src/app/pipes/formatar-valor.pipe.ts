import { Pipe, PipeTransform } from '@angular/core';
import { FormatarDadosService } from '../servicos';

@Pipe({
  name: 'formatarValor'
})
export class FormatarValorPipe implements PipeTransform {
  constructor(private formatarDados: FormatarDadosService) {}

  transform(valor: string | number, prefixo?: string): string {
    const retorno = this.formatarDados.formatarValor(valor);
    return ((retorno && prefixo) || '') + retorno;
  }
}
