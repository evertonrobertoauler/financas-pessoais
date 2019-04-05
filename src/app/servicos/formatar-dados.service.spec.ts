import { TestBed } from '@angular/core/testing';

import { FormatarDadosService } from './formatar-dados.service';

describe('Testando serviço responsavel pela formatação dos dados', () => {
  let service: FormatarDadosService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => (service = TestBed.get(FormatarDadosService)));

  it('Formatação valores no formato brasileiro', () => {
    expect(service.formatarValor(10)).toBe('10,00');
    expect(service.formatarValor(54610.01)).toBe('54.610,01');
    expect(service.formatarValor(-99.88)).toBe('-99,88');
    expect(service.formatarValor(-99.889999)).toBe('-99,89');
    expect(service.formatarValor('10')).toBe('0,10');
    expect(service.formatarValor('-5461001')).toBe('-54.610,01');
    expect(service.formatarValor('9988')).toBe('99,88');
    expect(service.formatarValor('-99.8899,999')).toBe('-9.988.999,99');
  });

  it('Formatação valores do formato brasileiro devem ser convertidos de volta para valores númericos', () => {
    expect(service.valorToNumber('10,00')).toBe(10);
    expect(service.valorToNumber('54.610,01')).toBe(54610.01);
    expect(service.valorToNumber('-99,88')).toBe(-99.88);
    expect(service.valorToNumber('-99,89')).toBe(-99.89);
    expect(service.valorToNumber('0,10')).toBe(0.1);
    expect(service.valorToNumber('-54.610,01')).toBe(-54610.01);
    expect(service.valorToNumber('99,88')).toBe(99.88);
    expect(service.valorToNumber('-9.988.999,99')).toBe(-9988999.99);
  });

  it('Formatação dadas no formato brasileiro', () => {
    expect(service.formatarData('1993-01-05', 'DD/MM/YYYY')).toBe('05/01/1993');
    expect(service.formatarData('2001-09-31 23:59:45', 'DD/MM/YYYY HH:mm:ss')).toBe(
      '01/10/2001 23:59:45'
    );
    expect(service.formatarData(new Date(2020, 11, 25), 'DD/MM/YYYY')).toBe('25/12/2020');
  });
});
