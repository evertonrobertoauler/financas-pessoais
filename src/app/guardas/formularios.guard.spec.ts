import { TestBed, async, inject } from '@angular/core/testing';

import { FormulariosGuard } from './formularios.guard';

describe('FormulariosGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormulariosGuard]
    });
  });

  it('should ...', inject([FormulariosGuard], (guard: FormulariosGuard) => {
    expect(guard).toBeTruthy();
  }));
});
