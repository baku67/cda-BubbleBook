import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageDiscoverComponent } from './landing-page-discover.component';

describe('LandingPageDiscoverComponent', () => {
  let component: LandingPageDiscoverComponent;
  let fixture: ComponentFixture<LandingPageDiscoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingPageDiscoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
