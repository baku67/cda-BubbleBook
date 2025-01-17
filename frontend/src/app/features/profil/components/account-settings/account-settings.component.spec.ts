import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingsComponent } from './account-settings.component';
import { PageHeaderComponent } from '../../../../shared/ui-components/page-header/page-header.component';
import { TranslateModule } from '@ngx-translate/core';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSettingsComponent],
      imports: [
        TranslateModule.forRoot(),
        PageHeaderComponent,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
