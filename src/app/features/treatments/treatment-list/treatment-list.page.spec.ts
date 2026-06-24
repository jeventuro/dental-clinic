import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreatmentListPage } from './treatment-list.page';

describe('TreatmentListPage', () => {
  let component: TreatmentListPage;
  let fixture: ComponentFixture<TreatmentListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
