import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfilComponent } from './user-profil.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PageHeaderComponent } from '../../../../shared/ui-components/page-header/page-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { UserCardComponent } from '../user-card/user-card.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('UserProfilComponent', () => {
  let component: UserProfilComponent;
  let fixture: ComponentFixture<UserProfilComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const mockUserService = jasmine.createSpyObj('UserService', ['getCurrentUser']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['resendConfirmationEmail']);
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [UserProfilComponent, UserCardComponent],
      imports: [
        HttpClientTestingModule,
        PageHeaderComponent,
        TranslateModule.forRoot(),
        MatProgressSpinnerModule,
        MatIconModule,
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        CUSTOM_ELEMENTS_SCHEMA
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfilComponent);
    component = fixture.componentInstance;

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user profile on init', () => {
    const mockUser = { email: 'test@example.com', isVerified: true } as any;
    userServiceSpy.getCurrentUser.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(userServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(component.user$).toEqual(mockUser);
    expect(component.isUserLoading).toBeFalse();
  });

  it('should handle error when fetching user profile', () => {
    userServiceSpy.getCurrentUser.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(userServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(component.user$).toBeUndefined();
    expect(component.isUserLoading).toBeFalse();
  });

  it('should resend confirmation email if user is not verified', () => {
    const mockUser = { email: 'test@example.com', isVerified: false } as any;
    component.user$ = mockUser;
    authServiceSpy.resendConfirmationEmail.and.returnValue(of({}));

    authServiceSpy.resendConfirmationEmail(mockUser.email);

    expect(authServiceSpy.resendConfirmationEmail).toHaveBeenCalledWith('test@example.com');
    expect(component.emailConfirmResent).toBeTrue();
    expect(component.emailConfirmResentLoading).toBeFalse();
  });

  it('should handle error when resending confirmation email', () => {
    const mockUser = { email: 'test@example.com', isVerified: false } as any;
    component.user$ = mockUser;
    authServiceSpy.resendConfirmationEmail.and.returnValue(throwError(() => new Error('Error')));

    spyOn(window, 'alert');
    authServiceSpy.resendConfirmationEmail(mockUser.email);

    expect(authServiceSpy.resendConfirmationEmail).toHaveBeenCalledWith('test@example.com');
    expect(component.emailConfirmResent).toBeFalse();
    expect(component.emailConfirmResentLoading).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith(
      "Impossible d'envoyer l'email de confirmation. Veuillez réessayer plus tard."
    );
  });

  it('should navigate to certificates page', () => {
    component.navigateCertificates();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/certificates']);
  });
});
