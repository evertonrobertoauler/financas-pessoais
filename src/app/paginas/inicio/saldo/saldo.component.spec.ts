import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioSaldoComponent } from './saldo.component';

describe('InicioSaldoComponent', () => {
  let component: InicioSaldoComponent;
  let fixture: ComponentFixture<InicioSaldoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InicioSaldoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioSaldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
