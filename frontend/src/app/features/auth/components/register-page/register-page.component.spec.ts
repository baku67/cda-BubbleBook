import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPageComponent } from './register-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/ui-components/page-header/page-header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
    
class MockAuthService {
  registerUser = jasmine.createSpy('registerUser').and.returnValue(of({}));
  login = jasmine.createSpy('login').and.returnValue(of({}));
  getFirstLoginStep = jasmine.createSpy('getFirstLoginStep').and.returnValue(1);
}

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterPageComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        PageHeaderComponent,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSlideToggleModule,
        RouterTestingModule.withRoutes([]),
        MatTooltipModule,
      ],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    // Forcer l'exécution de ngOnInit pour initialiser registerForm
    component.ngOnInit();
    // Simuler les asyncValidators
    spyOn(component.registerForm.get('email')!, 'setAsyncValidators').and.callFake(() => {});
    spyOn(component.registerForm.get('email')!, 'updateValueAndValidity').and.callFake(() => {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.registerForm).toBeDefined();
    const form = component.registerForm.value;
    expect(form.email).toBe('');
    expect(form.password).toBe('');
    expect(form.passwordCheck).toBe('');
    expect(form.is2fa).toBe(false);
    expect(form.acceptTerms).toBe(false);
  });

  it('should submit valid form and navigate to first login step', () => {
    component.registerForm.get('email')?.setAsyncValidators(() => of(null)); // Simule la validation asynchrone réussie
    component.registerForm.get('email')?.updateValueAndValidity();

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      passwordCheck: 'password123',
      is2fa: false,
      acceptTerms: true,
    });

    component.onSubmit();

    expect(authService.registerUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      passwordCheck: 'password123',
      // is2fa: false,
      acceptTerms: true,
    });
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    });
    expect(router.navigate).toHaveBeenCalledWith(['/first-login/step-one']);
  });

  it('should not submit an invalid form', () => {
    component.registerForm.get('email')?.setAsyncValidators(() => of(null)); // Simule la validation asynchrone réussie
    component.registerForm.get('email')?.updateValueAndValidity();

    component.registerForm.setValue({
      email: '',
      password: 'short',
      passwordCheck: 'short',
      is2fa: false,
      acceptTerms: false,
    });

    component.onSubmit();

    expect(authService.registerUser).not.toHaveBeenCalled();
    expect(authService.login).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should handle registration error', () => {
    component.registerForm.get('email')?.setAsyncValidators(() => of(null)); // Simule la validation asynchrone réussie
    component.registerForm.get('email')?.updateValueAndValidity();
    (authService.registerUser as jasmine.Spy).and.returnValue(throwError(() => ({ status: 400 })));

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      passwordCheck: 'password123',
      is2fa: false,
      acceptTerms: true,
    });

    component.onSubmit();

    expect(authService.registerUser).toHaveBeenCalled();
    expect(authService.login).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should handle auto-login error', () => {
    component.registerForm.get('email')?.setAsyncValidators(() => of(null)); // Simuler la validation réussie
    component.registerForm.get('email')?.updateValueAndValidity();

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      passwordCheck: 'password123',
      is2fa: false,
      acceptTerms: true,
    });

    (authService.registerUser as jasmine.Spy).and.returnValue(of({}));
    (authService.login as jasmine.Spy).and.returnValue(throwError(() => ({ status: 401 })));

    component.onSubmit();

    expect(authService.registerUser).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should toggle password1 visibility', () => {
    const initial = component.hidePassword1;
    component.togglePassword1Visibility();
    expect(component.hidePassword1).toBe(!initial);
  });

  it('should toggle password2 visibility', () => {
    const initial = component.hidePassword2;
    component.togglePassword2Visibility();
    expect(component.hidePassword2).toBe(!initial);
  });
});
    