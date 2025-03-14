import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../../../shared/validators/passwordMatchValidator';
import { EmailCheckService } from '../../services/email-disponibility.service';
import { EmailAsyncValidator } from '../../../../shared/validators/emailExistValidator';
import { AuthService } from '../../services/auth.service';
import { passwordComplexityValidator } from '../../../../shared/validators/passwordComplexityValidator';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { LoginData, RegisterData } from '../../models/auth.types';


@Component({
  selector: 'app-register',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit{

  registerForm!: FormGroup;
  isSubmitting: boolean;
  emailChecking = false;
  emailAvailable: boolean | null = null;
  hidePassword1 = true;
  hidePassword2 = true;
  passwordComplexityScore = 0;

  isAnimatingFadeOut = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder, 
    private emailCheckService: EmailCheckService,
    private translateService: TranslateService,
    private router: Router,
    private animationService: AnimationService,
  ) {
    this.isSubmitting = false;
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: this.formBuilder.control(
        '', 
        {
          validators: [Validators.required, Validators.email], 
          asyncValidators: [EmailAsyncValidator.createValidator(this.emailCheckService, this)], 
          updateOn: 'blur' 
        }
      ),
      password: [
        '', 
        [
          Validators.required, 
          Validators.minLength(8), // seul critère bloquant (jauge -> onPasswordInput())
        ]
      ], 
      passwordCheck: ['', [Validators.required]],
      acceptTerms: [false, Validators.requiredTrue],
      rememberMe: [true] // Ajout du champ rememberMe pour le auto-login qui suit
    }, { validator: passwordMatchValidator });
  }


  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isSubmitting = true;

      const registerData: RegisterData = {
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        passwordCheck: this.registerForm.get('passwordCheck')?.value,
        acceptTerms: this.registerForm.get('acceptTerms')?.value
      };

      this.authService.registerUser(registerData).subscribe({
        next: () => {
          console.log('User registered successfully');

          const loginData: LoginData = {
            email: this.registerForm.get('email')?.value,
            password: this.registerForm.get('password')?.value,
            rememberMe: this.registerForm.get('rememberMe')?.value
          };

          this.authService.login(loginData).subscribe({
            next: () => {
              const step = this.authService.getFirstLoginStep();
              if (step === 1) {
                this.router.navigate(['/first-login/step-one']);
              } else if (step === 2) {
                this.router.navigate(['/first-login/step-two']);
              } else {
                this.router.navigate(['/user-profil']);
              }
              // this.isSubmitting = false; // désactivé car enchaine avec un loading fatchdata (dailleurs plutot resolver ça?)
            },
            error: (error) => {
              console.error('Auto-login failed', error);
              this.isSubmitting = false;
            }
          });
        },
        error: (error) => {
          console.error('There was an error during the request (register)', error);
          this.isSubmitting = false;
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  togglePassword1Visibility(): void {
    this.hidePassword1 = !this.hidePassword1;
  }
  togglePassword2Visibility(): void {
    this.hidePassword2 = !this.hidePassword2;
  }


  // passwordComplexityValidator.ts  (jauge mot de passe)
  onPasswordInput(): void {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl) {
      const errors = passwordComplexityValidator()(passwordControl);
      if (errors && errors['passwordComplexityScore'] !== undefined) {
        this.passwordComplexityScore = errors['passwordComplexityScore'];
      } else {
        this.passwordComplexityScore = 0;
      }
    }
  }


  // Message de status de la vérification de disponibilité de l'adresse mail (ToolTip de l'icon de champs)
  get emailStatusMessage(): string {
    if (this.emailChecking) {
      return this.translateService.instant('EMAIL_ADDRESS_CHECKING');
    }
    if (this.emailAvailable === true) {
      return this.translateService.instant('EMAIL_ADDRESS_AVAILABLE');
    }
    if (this.emailAvailable === false) {
      return this.translateService.instant('EMAIL_ADDRESS_ALREADY_USED');
    }
    return '';
  }

  get passwordStrengthColor(): string {
    if (this.passwordComplexityScore <= 2) {
      return 'weak'; // Rouge
    } else if (this.passwordComplexityScore <= 4) {
      return 'medium'; // Jaune
    } else {
      return 'strong'; // Vert
    }
  }

  get passwordErrorMessage(): string | null {
    const passwordControl = this.registerForm.get('password');

    if (passwordControl?.hasError('required')) {
      return this.translateService.instant('PASSWORD_REQUIRED');
    }

    if (passwordControl?.hasError('minlength')) {
      return this.translateService.instant('PASSWORD_MIN_LENGTH', { minLength: 8 });
    }
    return null;
  }

  // Tooltip sur le bouton de validation de form
  get acceptTermsTooltip(): string {
    if (this.registerForm.get('acceptTerms')?.value) {
      return '';
    } else {
      return this.translateService.instant('ACCEPT_TERMS_MANDATORY');
    }
  }
}