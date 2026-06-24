import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentFormPage } from './appointment-form.page';

describe('AppointmentFormPage', () => {
  let component: AppointmentFormPage;
  let fixture: ComponentFixture<AppointmentFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
