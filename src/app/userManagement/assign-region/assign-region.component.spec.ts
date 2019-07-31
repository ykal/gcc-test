import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRegionComponent } from './assign-region.component';

describe('AssignRegionComponent', () => {
  let component: AssignRegionComponent;
  let fixture: ComponentFixture<AssignRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
