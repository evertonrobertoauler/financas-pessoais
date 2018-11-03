import { Injectable } from '@angular/core';
import * as VMasker from 'vanilla-masker';
import { format, distanceInWordsToNow } from 'date-fns';
import * as pt from 'date-fns/locale/pt';

@Injectable({ providedIn: 'root' })
export class FormatarDadosService {
  constructor() {}

  formatarValor(valor: number | string) {
    if (typeof valor === 'number') {
      return VMasker.toMoney(valor.toFixed(2));
    } else {
      return valor ? VMasker.toMoney(valor) : valor;
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
    return data ? format(data, formato, { locale: pt }) : '';
  }

  formatarDistanciaData(data: Date | string) {
    return data ? distanceInWordsToNow(data, { locale: pt }) : '';
  }

  capitalizar(str: string) {
    if (typeof str === 'string') {
      str = str.trim();
      return str.slice(0, 1).toUpperCase() + str.slice(1);
    } else {
      return str;
    }
  }
}
