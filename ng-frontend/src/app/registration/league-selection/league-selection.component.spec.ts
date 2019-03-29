import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueSelectionComponent } from './league-selection.component';

describe('LeagueSelectionComponent', () => {
  let component: LeagueSelectionComponent;
  let fixture: ComponentFixture<LeagueSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeagueSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
