import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingsPrivacyComponent } from './account-settings-privacy.component';

describe('AccountSettingsPrivacyComponent', () => {
  let component: AccountSettingsPrivacyComponent;
  let fixture: ComponentFixture<AccountSettingsPrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSettingsPrivacyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSettingsPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
