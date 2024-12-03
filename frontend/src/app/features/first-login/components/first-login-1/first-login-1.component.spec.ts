import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstLogin1Component } from './first-login-1.component';

describe('FirstLogin1Component', () => {
  let component: FirstLogin1Component;
  let fixture: ComponentFixture<FirstLogin1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirstLogin1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstLogin1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
