import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProgressReportComponent } from './create-progress-report.component';

describe('CreateProgressReportComponent', () => {
  let component: CreateProgressReportComponent;
  let fixture: ComponentFixture<CreateProgressReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProgressReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProgressReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
