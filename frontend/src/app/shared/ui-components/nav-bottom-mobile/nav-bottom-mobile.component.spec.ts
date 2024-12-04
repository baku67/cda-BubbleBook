import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBottomMobileComponent } from './nav-bottom-mobile.component';

describe('NavBottomMobileComponent', () => {
  let component: NavBottomMobileComponent;
  let fixture: ComponentFixture<NavBottomMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavBottomMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBottomMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
