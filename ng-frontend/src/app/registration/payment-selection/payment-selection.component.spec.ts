import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSelectionComponent } from './payment-selection.component';

describe('PaymentSelectionComponent', () => {
  let component: PaymentSelectionComponent;
  let fixture: ComponentFixture<PaymentSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
