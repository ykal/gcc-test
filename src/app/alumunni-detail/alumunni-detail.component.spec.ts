import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumunniDetailComponent } from './alumunni-detail.component';

describe('AlumunniDetailComponent', () => {
  let component: AlumunniDetailComponent;
  let fixture: ComponentFixture<AlumunniDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumunniDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumunniDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
