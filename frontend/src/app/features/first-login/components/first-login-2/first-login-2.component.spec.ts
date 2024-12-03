import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstLogin2Component } from './first-login-2.component';

describe('FirstLogin2Component', () => {
  let component: FirstLogin2Component;
  let fixture: ComponentFixture<FirstLogin2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirstLogin2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstLogin2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
