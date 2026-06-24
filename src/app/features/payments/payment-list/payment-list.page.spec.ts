import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentListPage } from './payment-list.page';

describe('PaymentListPage', () => {
  let component: PaymentListPage;
  let fixture: ComponentFixture<PaymentListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
