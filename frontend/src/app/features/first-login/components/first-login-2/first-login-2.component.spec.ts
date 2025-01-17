import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FirstLogin2Component } from './first-login-2.component';
import { UserService } from '../../../profil/services/user.service';
import { FirstLoginService } from '../../services/first-login.service';
import { ModalService } from '../../../../shared/services/utils/modal.service';
import { of, throwError } from 'rxjs';
import { PageHeaderComponent } from '../../../../shared/ui-components/page-header/page-header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertBannerComponent } from '../../../../shared/ui-components/alert-banner/alert-banner.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectCountryComponent } from '@angular-material-extensions/select-country';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectCountryLangToken } from '@angular-material-extensions/select-country';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';

describe('FirstLogin2Component', () => {
  let component: FirstLogin2Component;
  let fixture: ComponentFixture<FirstLogin2Component>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let firstLoginServiceSpy: jasmine.SpyObj<FirstLoginService>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', ['getCurrentUser']);
    const firstLoginSpy = jasmine.createSpyObj('FirstLoginService', ['updateUser', 'skipStep']);
    const modalSpy = jasmine.createSpyObj('ModalService', ['open']);

    await TestBed.configureTestingModule({
      declarations: [
        FirstLogin2Component,
        MatSelectCountryComponent,
      ],
      imports: [
        ReactiveFormsModule, 
        TranslateModule.forRoot(),
        PageHeaderComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        MatProgressSpinnerModule,
        AlertBannerComponent,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatDividerModule,
        MatAutocompleteModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatProgressBarModule,
        // MatSelectCountryComponent,
      ],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: FirstLoginService, useValue: firstLoginSpy },
        { provide: ModalService, useValue: modalSpy },
        { provide: MatSelectCountryLangToken, useValue: 'en' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstLogin2Component);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    firstLoginServiceSpy = TestBed.inject(FirstLoginService) as jasmine.SpyObj<FirstLoginService>;
    modalServiceSpy = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;

    userServiceSpy.getCurrentUser.and.returnValue(of({ username: 'testUser', email: 'test@test.fr', accountType: 'option-diver', nationality: 'FR', avatarUrl: '', bannerUrl: '', isVerified: false, is2fa: false }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with user data', () => {
    expect(component.firstLoginForm2).toBeDefined();
    expect(component.firstLoginForm2.get('username')?.value).toBe('testUser');
    expect(component.firstLoginForm2.get('nationality')?.value).toBe('FR');
    expect(component.selectedAvatar).toBeTruthy();
    expect(component.selectedBanner).toBeTruthy();
  });

  it('should select an avatar and update the form', () => {
    const mockAvatar = 'assets/images/default/avatars/profil-picture-default-2.webp';
    component.selectAvatar(mockAvatar);
    expect(component.selectedAvatar).toBe(mockAvatar);
    expect(component.firstLoginForm2.get('avatar')?.value).toBe(mockAvatar);
  });

  it('should select a banner and update the form', () => {
    const mockBanner = 'assets/images/default/banners/default-banner-2.webp';
    component.selectBanner(mockBanner);
    expect(component.selectedBanner).toBe(mockBanner);
    expect(component.firstLoginForm2.get('banner')?.value).toBe(mockBanner);
  });

  it('should submit the form and navigate to user profile on success', () => {
    component.firstLoginForm2.setValue({
      username: 'testUser',
      nationality: 'FR',
      avatar: 'mock-avatar',
      banner: 'mock-banner',
    });
    firstLoginServiceSpy.updateUser.and.returnValue(of(undefined));

    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.onSubmit();

    expect(firstLoginServiceSpy.updateUser).toHaveBeenCalledWith(component.firstLoginForm2.value);
    expect(navigateSpy).toHaveBeenCalledWith(['/user-profil']);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle errors when submitting the form', () => {
    component.firstLoginForm2.setValue({
      username: 'testUser',
      nationality: 'FR',
      avatar: 'mock-avatar',
      banner: 'mock-banner',
    });
    firstLoginServiceSpy.updateUser.and.returnValue(throwError(() => new Error('Error updating user')));

    component.onSubmit();

    expect(firstLoginServiceSpy.updateUser).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should skip the step and navigate to user profile on success', () => {
    firstLoginServiceSpy.skipStep.and.returnValue(of(undefined));

    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.onSkipStep();

    expect(firstLoginServiceSpy.skipStep).toHaveBeenCalledWith(2);
    expect(navigateSpy).toHaveBeenCalledWith(['/user-profil']);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle errors when skipping the step', () => {
    firstLoginServiceSpy.skipStep.and.returnValue(throwError(() => new Error('Error skipping step')));

    component.onSkipStep();

    expect(firstLoginServiceSpy.skipStep).toHaveBeenCalledWith(2);
    expect(component.isLoading).toBeFalse();
  });
});
