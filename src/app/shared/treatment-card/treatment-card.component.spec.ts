import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TreatmentCardComponent } from './treatment-card.component';

describe('TreatmentCardComponent', () => {
  let component: TreatmentCardComponent;
  let fixture: ComponentFixture<TreatmentCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TreatmentCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TreatmentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
