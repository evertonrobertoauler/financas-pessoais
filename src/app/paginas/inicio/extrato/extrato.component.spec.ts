import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioExtratoComponent } from './extrato.component';

describe('InicioExtratoComponent', () => {
  let component: InicioExtratoComponent;
  let fixture: ComponentFixture<InicioExtratoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InicioExtratoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioExtratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
