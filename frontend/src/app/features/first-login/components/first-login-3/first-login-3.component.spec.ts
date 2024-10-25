import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstLogin3Component } from './first-login-3.component';

describe('FirstLogin3Component', () => {
  let component: FirstLogin3Component;
  let fixture: ComponentFixture<FirstLogin3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstLogin3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstLogin3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
