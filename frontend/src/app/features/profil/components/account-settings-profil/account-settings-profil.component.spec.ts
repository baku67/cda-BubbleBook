import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingsProfilComponent } from './account-settings-profil.component';

describe('AccountSettingsProfilComponent', () => {
  let component: AccountSettingsProfilComponent;
  let fixture: ComponentFixture<AccountSettingsProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSettingsProfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSettingsProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
