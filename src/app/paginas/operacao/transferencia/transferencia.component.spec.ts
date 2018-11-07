import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacaoTransferenciaComponent } from './transferencia.component';

describe('TransferenciaComponent', () => {
  let component: OperacaoTransferenciaComponent;
  let fixture: ComponentFixture<OperacaoTransferenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OperacaoTransferenciaComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperacaoTransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
