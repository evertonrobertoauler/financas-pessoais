import { Pipe, PipeTransform } from '@angular/core';
import { FormatarDadosService } from '../servicos';
import { Timestamp } from '@firebase/firestore-types';

@Pipe({
  name: 'formatarData'
})
export class FormatarDataPipe implements PipeTransform {
  constructor(private formatarDados: FormatarDadosService) {}

  transform(valor: string | Date | Timestamp, formato: string | 'distancia'): string {
    let valorD: Date | string;

    if (valor instanceof Date || typeof valor === 'string') {
      valorD = valor;
    } else if (valor && 'toDate' in valor) {
      valorD = valor.toDate();
    } else {
      return '';
    }

    switch (formato) {
      case 'distancia':
        return this.formatarDados.formatarDistanciaData(valorD);
      default:
        return this.formatarDados.formatarData(valorD, formato);
    }
  }
}
