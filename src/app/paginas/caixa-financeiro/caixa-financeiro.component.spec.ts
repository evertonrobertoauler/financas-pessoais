import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaixaFinanceiroComponent } from './caixa-financeiro.component';

describe('CaixaFinanceiroComponent', () => {
  let component: CaixaFinanceiroComponent;
  let fixture: ComponentFixture<CaixaFinanceiroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaixaFinanceiroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaixaFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
