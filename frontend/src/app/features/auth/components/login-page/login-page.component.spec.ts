import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginPageComponent } from './login-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PageHeaderComponent } from '../../../../shared/ui-components/page-header/page-header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterTestingModule } from '@angular/router/testing';

class MockAuthService {
  login = jasmine.createSpy('login').and.returnValue(of({}));
  getFirstLoginStep = jasmine.createSpy('getFirstLoginStep').and.returnValue(3); 
}

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      imports: [
        HttpClientTestingModule,
        PageHeaderComponent,
        MatFormFieldModule,
        TranslateModule.forRoot(),
        MatInputModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSlideToggleModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
    expect(component.loginForm.controls['rememberMe']).toBeDefined();
  });

  it('should display error message if form is invalid on submit', () => {
    component.onSubmit();
    expect(component.errorMessage).toEqual('Please fill in all required fields correctly.');
  });

  it('should call authService.login with correct data when form is valid', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    });
  });

  it('should navigate to appropriate route after successful login when user step is 1', () => {
    authService.getFirstLoginStep = jasmine.createSpy().and.returnValue(1);

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/first-login/step-one']);
  });

  it('should navigate to appropriate route after successful login when user step is 2', () => {
    authService.getFirstLoginStep = jasmine.createSpy().and.returnValue(2);

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/first-login/step-two']);
  });

  it('should navigate to appropriate route after successful login when user step is null', () => {
    authService.getFirstLoginStep = jasmine.createSpy().and.returnValue(null);

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/user-profil']);
  });

  it('should handle login error correctly', () => {
    authService.login = jasmine.createSpy().and.returnValue(throwError({ status: 401 }));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'wrongpassword',
      rememberMe: false,
    });

    component.onSubmit();

    expect(component.errorMessage).toEqual('Identifiants incorrects. Veuillez vérifier votre email et mot de passe.');
    expect(component.isLoading).toBeFalse();
  });

  it('should toggle password visibility', () => {
    const initialHidePassword = component.hidePassword;

    component.togglePasswordVisibility();

    expect(component.hidePassword).toBe(!initialHidePassword);
  });
});
