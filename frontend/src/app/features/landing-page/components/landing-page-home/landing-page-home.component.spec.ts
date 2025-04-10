import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageHomeComponent } from './landing-page-home.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('LandingPageHomeComponent', () => {
  let component: LandingPageHomeComponent;
  let fixture: ComponentFixture<LandingPageHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingPageHomeComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule]
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
