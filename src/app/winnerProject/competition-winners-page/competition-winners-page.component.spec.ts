import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionWinnersPageComponent } from './competition-winners-page.component';

describe('CompetitionWinnersPageComponent', () => {
  let component: CompetitionWinnersPageComponent;
  let fixture: ComponentFixture<CompetitionWinnersPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitionWinnersPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionWinnersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
