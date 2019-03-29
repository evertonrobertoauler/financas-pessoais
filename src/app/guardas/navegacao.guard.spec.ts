import { TestBed, async, inject } from '@angular/core/testing';

import { NavegacaoGuard } from './navegacao.guard';

describe('NavegacaoGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavegacaoGuard]
    });
  });

  it('should ...', inject([NavegacaoGuard], (guard: NavegacaoGuard) => {
    expect(guard).toBeTruthy();
  }));
});
