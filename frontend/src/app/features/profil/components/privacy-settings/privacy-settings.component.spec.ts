import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacySettingsComponent } from './privacy-settings.component';

describe('PrivacySettingsComponent', () => {
  let component: PrivacySettingsComponent;
  let fixture: ComponentFixture<PrivacySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacySettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
