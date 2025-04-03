import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageHomeComponent } from './landing-page-home.component';

describe('LandingPageHomeComponent', () => {
  let component: LandingPageHomeComponent;
  let fixture: ComponentFixture<LandingPageHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
