import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingsInterfaceComponent } from './account-settings-interface.component';

describe('AccountSettingsInterfaceComponent', () => {
  let component: AccountSettingsInterfaceComponent;
  let fixture: ComponentFixture<AccountSettingsInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSettingsInterfaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSettingsInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
