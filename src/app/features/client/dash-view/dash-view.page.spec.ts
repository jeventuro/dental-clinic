import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashViewPage } from './dash-view.page';

describe('DashViewPage', () => {
  let component: DashViewPage;
  let fixture: ComponentFixture<DashViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
