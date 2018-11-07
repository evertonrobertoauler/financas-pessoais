import { Injectable } from '@angular/core';
import * as VMasker from 'vanilla-masker';
import { format, distanceInWordsToNow } from 'date-fns';
import * as pt from 'date-fns/locale/pt';

@Injectable({ providedIn: 'root' })
export class FormatarDadosService {
  constructor() {}

  formatarValor(valor: number | string) {
    if (typeof valor === 'number') {
      return (valor < 0 ? '-' : '') + VMasker.toMoney(valor.toFixed(2));
    } else {
      return valor ? (valor[0] === '-' ? '-' : '') + VMasker.toMoney(valor) : valor;
    }
  }

  valorToNumber(valor: number | string) {
    if (typeof valor === 'number') {
      return valor;
    } else {
      return valor ? parseFloat(valor.replace(/\./gi, '').replace(',', '.')) : null;
    }
  }

  dashify(str: string) {
    if (typeof str === 'string') {
      return str
        .toLowerCase()
        .replace(/[ç]/g, 'c')
        .replace(/[áãàâ]/g, 'a')
        .replace(/[éê]/g, 'e')
        .replace(/[í]/g, 'i')
        .replace(/[óõô]/g, 'o')
        .replace(/[ú]/g, 'u')
        .replace(/[ \t\W]/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/--+/g, '-');
    }

    return str;
  }

  formatarData(data: Date | string, formato: string) {
    return this.capitalizarPalavras((data && format(data, formato, { locale: pt })) || '');
  }

  formatarDistanciaData(data: Date | string) {
    const retorno = (data && distanceInWordsToNow(data, { locale: pt, addSuffix: true })) || '';
    return retorno.replace(/aproximadamente/, 'aprox.');
  }

  capitalizar(str: string) {
    if (typeof str === 'string') {
      return str.replace(/^\s*\w/gi, l => l.toUpperCase());
    } else {
      return str;
    }
  }

  capitalizarPalavras(str: string) {
    const PREPOSICOES = ['a', 'com', 'em', 'por', 'entre', 'sem', 'de', 'para', 'sob', 'desde'];

    if (typeof str === 'string') {
      return str.replace(/\b\w+/gi, w => (PREPOSICOES.indexOf(w) !== -1 ? w : this.capitalizar(w)));
    } else {
      return str;
    }
  }
}
