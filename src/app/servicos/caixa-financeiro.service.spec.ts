import { TestBed } from '@angular/core/testing';

import { CaixaFinanceiroService } from './caixa-financeiro.service';

describe('CaixaFinanceiroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaixaFinanceiroService = TestBed.get(CaixaFinanceiroService);
    expect(service).toBeTruthy();
  });
});
