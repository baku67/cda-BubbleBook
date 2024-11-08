import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
 
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private router: Router,
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
          Validators.minLength(8),
          passwordComplexityValidator(), // multiples regex de validation des critères mdp
        ]
      ], 
      passwordCheck: ['', [Validators.required]],
      is2fa: [false], // false par defaut TODO
      acceptTerms: [false, Validators.requiredTrue],
    }, { validator: passwordMatchValidator });
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


  // Fonction de vérification si l'email existe déjà
  // Méthode pour afficher l'état de l'email
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

  // passwordComplexityValidator: construction de la phrase d'erreur
  get passwordErrorMessage(): string | null {
    const passwordControl = this.registerForm.get('password');

    if (passwordControl?.hasError('required')) {
      return 'Le mot de passe est requis.';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    if (passwordControl?.hasError('passwordComplexity')) {
      const errors = passwordControl.getError('passwordComplexity');
      const missingCriteria = Object.values(errors).join(', ');
      return `Le mot de passe doit contenir au moins ${missingCriteria}.`;
    }
    return null;
  }
}