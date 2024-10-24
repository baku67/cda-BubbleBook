import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environments';
// rxjs: debounce/throttlong input checkEmail:
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators'; // Import des opérateurs rxjs
// Customs:
import { passwordMatchValidator } from '../../../../shared/error/passwordMatchValidator.directive';
import { EmailCheckService } from '../../services/email-disponibility.service';
import { EmailAsyncValidator } from '../../../../shared/error/emailExistValidator';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit{

  registerForm!: FormGroup;
  isLoading: boolean;
  emailExists = false;

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
        [EmailAsyncValidator.createValidator(this.emailCheckService)] // Validateur asynchrone
      ],
      username: ['', Validators.required], // TODO (dev)
      password: ['', [Validators.required, Validators.minLength(6)]], //TODO (dev) + regex specialchars etc
      passwordCheck: ['', [Validators.required]],
      is2fa: [false], // Todo: false par defaut et demandé sur prochain écran (les 2-3 premiers login)
      roles: [['user']],
      isVerified: [false]
    }, { validator: passwordMatchValidator });
  }


  onSubmit(): void {
    if (this.registerForm.valid) {

      // Loader/Spinner
      this.isLoading = true;

      // API register (voir environemnt.ts pour switch mobile debug):
      this.http.post(`${environment.apiUrl}/api/register`, this.registerForm.value)
        .subscribe(
          (response) => {
            console.log('User registered successfully', response);
            // this.router.navigate(['/login']); 
            // Auto-login après l'inscription
            this.autoLogin();
          },
          (error) => {
            console.error('There was an error during the request (register)', error);
          }
        );
    } else {
      console.error('Form is invalid');
    }
  }


  // Fonction pour l'auto-login après l'inscription
  autoLogin() {
    const loginCredentials = {
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value
    };

    this.http.post<{ token: string }>(`${environment.apiUrl}/api/login`, loginCredentials)
      .subscribe({
        next: (response) => {
            // Stocker le token JWT dans le localStorage (<--> auth.service)
            this.authService.setToken(response.token);

          // Rediriger vers une page sécurisée après l'auto-login (Comme c'est juste après register(), mettre la page /first-login-1)
          this.router.navigate(['/first-login/step-one']);

          // Désactiver le loader
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Auto-login failed', error);
          this.isLoading = false; // Désactiver le loader en cas d'échec
        }
      });
  }


  // Fonction de vérification si l'email existe déjà
  checkEmail() {
    const email = this.registerForm.get('email')?.value;
    if (email) {
      this.emailCheckService.checkEmailExists(email).subscribe((response) => {
        this.emailExists = response.exists;
      });
    }
  }
}