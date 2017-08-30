import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroPowerButtonComponent } from './hero-power-button.component';

describe('HeroPowerButtonComponent', () => {
  let component: HeroPowerButtonComponent;
  let fixture: ComponentFixture<HeroPowerButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroPowerButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroPowerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
