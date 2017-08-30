import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinionSpaceComponent } from './minion-space.component';

describe('MinionSpaceComponent', () => {
  let component: MinionSpaceComponent;
  let fixture: ComponentFixture<MinionSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinionSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinionSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
