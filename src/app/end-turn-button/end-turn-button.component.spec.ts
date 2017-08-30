import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndTurnButtonComponent } from './end-turn-button.component';

describe('EndTurnButtonComponent', () => {
  let component: EndTurnButtonComponent;
  let fixture: ComponentFixture<EndTurnButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndTurnButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndTurnButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
