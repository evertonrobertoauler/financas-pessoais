import { TestBed } from '@angular/core/testing';

import { FormatarDadosService } from './formatar-dados.service';

describe('FormatarDadosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormatarDadosService = TestBed.get(FormatarDadosService);
    expect(service).toBeTruthy();
  });
});
