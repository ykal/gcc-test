import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagManagmentComponent } from './tag-managment.component';

describe('TagManagmentComponent', () => {
  let component: TagManagmentComponent;
  let fixture: ComponentFixture<TagManagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagManagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
