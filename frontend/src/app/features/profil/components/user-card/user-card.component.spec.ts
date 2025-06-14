import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';
import { UserProfil } from '../../models/userProfile.model';
import { Country, COUNTRIES_DB } from '@angular-material-extensions/select-country';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrivacyOption } from '../../models/privacy-option';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserCardComponent],
      imports: [
        TranslateModule.forRoot(),
        MatTooltipModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set country and flagSvgUrl correctly when nationality is valid', () => {
    const mockUser: UserProfil = {
      username: 'test',
      email: 'test@test.fr',
      pendingEmail: undefined,
      firstLoginStep: 2,
      accountType: 'option-diver',
      nationality: 'FRA', // France
      avatarUrl: '',
      bannerUrl: '',
      initialDivesCount: 100,
      isVerified: false,
      is2fa: false,
      profilPrivacy: PrivacyOption.ALL,
      logBooksPrivacy: PrivacyOption.NO_ONE,
      certificatesPrivacy: PrivacyOption.NO_ONE,
      galleryPrivacy: PrivacyOption.NO_ONE,
      divesCount: 0
    };
    component.user = mockUser;

    fixture.detectChanges();

    const expectedCountry: Country | undefined = COUNTRIES_DB.find(c => c.alpha3Code === 'FRA');
    expect(component.country).toEqual(expectedCountry);
    if (expectedCountry) {
      expect(component.flagSvgUrl).toBe(`assets/svg-country-flags/svg/${expectedCountry.alpha2Code.toLowerCase()}.svg`);
    }
  });

  it('should log a warning when nationality is not found in COUNTRIES_DB', () => {
    spyOn(console, 'warn');
    const mockUser: UserProfil = {
      username: 'test',
      email: 'test@test.fr',
      pendingEmail: undefined,
      firstLoginStep: 2,
      accountType: 'option-diver',
      nationality: 'XYZ', // Code invalide
      avatarUrl: '',
      bannerUrl: '',
      initialDivesCount: 100,
      isVerified: false,
      is2fa: false,    
      profilPrivacy: PrivacyOption.ALL,
      logBooksPrivacy: PrivacyOption.NO_ONE,
      certificatesPrivacy: PrivacyOption.NO_ONE,
      galleryPrivacy: PrivacyOption.NO_ONE,
      divesCount: 0
    };
    component.user = mockUser;

    fixture.detectChanges();

    expect(component.country).toBeUndefined();
    expect(component.flagSvgUrl).toBeUndefined();
    expect(console.warn).toHaveBeenCalledWith('Pays introuvable pour le code', 'XYZ');
  });

  it('should set default flag when nationality is undefined', () => {
    component.user = {
      username: 'test',
      email: 'test@test.fr',
      accountType: 'option-diver',
      nationality: undefined, 
      avatarUrl: '',
      bannerUrl: '',
      isVerified: false,
      is2fa: false,
    } as unknown as UserProfil;

    fixture.detectChanges();

    expect(component.country).toBeUndefined();
    expect(component.flagSvgUrl).toBe('assets/images/default-flag.png');
  });

  it('should set default flag when user is undefined', () => {
    component.user = undefined;

    fixture.detectChanges();

    expect(component.country).toBeUndefined();
    expect(component.flagSvgUrl).toBe('assets/images/default-flag.png');
  });
});
