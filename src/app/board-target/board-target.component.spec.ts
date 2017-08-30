import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardTargetComponent } from './board-target.component';

describe('BoardTargetComponent', () => {
  let component: BoardTargetComponent;
  let fixture: ComponentFixture<BoardTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
