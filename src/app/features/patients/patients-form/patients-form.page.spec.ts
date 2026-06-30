import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientsFormPage } from './patients-form.page';

describe('PatientsFormPage', () => {
  let component: PatientsFormPage;
  let fixture: ComponentFixture<PatientsFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
