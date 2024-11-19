import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// rxjs: debounce/throttlong input checkEmail:
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators'; // Import des opérateurs rxjs
// Customs:
import { passwordMatchValidator } from '../../../../shared/validators/passwordMatchValidator';
import { EmailCheckService } from '../../services/email-disponibility.service';
import { EmailAsyncValidator } from '../../../../shared/validators/emailExistValidator';
import { AuthService } from '../../services/auth.service';
import { passwordComplexityValidator } from '../../../../shared/validators/passwordComplexityValidator';


@Component({
  selector: 'app-register',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit{

  registerForm!: FormGroup;
  isLoading: boolean;

  emailChecking = false;
  emailAvailable: boolean | null = null;

  hidePassword1 = true;
  hidePassword2 = true;

  passwordComplexityScore = 0;

 
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder, 
    private emailCheckService: EmailCheckService,
  ) {
    this.isLoading = false;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: [
        '', 
        [Validators.required, Validators.email], // Validateurs synchrones
        [EmailAsyncValidator.createValidator(this.emailCheckService, this)] // Validateur asynchrone (on lui passe le composant)
      ],
      username: ['', Validators.required], 
      password: [
        '', 
        [
          Validators.required, 
          Validators.minLength(8), // seul critère bloquant (jauge -> onPasswordInput())
        ]
      ], 
      passwordCheck: ['', [Validators.required]],
      is2fa: [false], // false par defaut TODO
      acceptTerms: [false, Validators.requiredTrue],
    }, { validator: passwordMatchValidator });
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


  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;

      this.authService.registerUser(this.registerForm.value).subscribe({
        next: () => {
          console.log('User registered successfully');
          this.authService.autoLoginAfterRegister(
            this.registerForm.get('email')?.value,
            this.registerForm.get('password')?.value
          );
        },
        error: (error) => {
          console.error('There was an error during the request (register)', error);
          this.isLoading = false;
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

  // Message de status de la vérification de disponibilité de l'adresse mail (ToolTip de l'icon de champs)
  get emailStatusMessage(): string {
    if (this.emailChecking) {
      return 'Vérification de la disponibilité de l\'email...';
    }
    if (this.emailAvailable === true) {
      return 'Adresse email disponible !';
    }
    if (this.emailAvailable === false) {
      return 'Cet email est déjà utilisé.';
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


  // passwordComplexityValidator: construction de la phrase d'erreur
  get passwordErrorMessage(): string | null {
    const passwordControl = this.registerForm.get('password');

    if (passwordControl?.hasError('required')) {
      return 'Le mot de passe est requis.';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    return null;
  }
}