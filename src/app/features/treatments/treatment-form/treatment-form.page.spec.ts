import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreatmentFormPage } from './treatment-form.page';

describe('TreatmentFormPage', () => {
  let component: TreatmentFormPage;
  let fixture: ComponentFixture<TreatmentFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
