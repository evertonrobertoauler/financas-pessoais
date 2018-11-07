import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacaoTransacaoComponent } from './transacao.component';

describe('TransacaoComponent', () => {
  let component: OperacaoTransacaoComponent;
  let fixture: ComponentFixture<OperacaoTransacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OperacaoTransacaoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperacaoTransacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
