import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit{

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder, 
    private router: Router,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required]], 
      rememberMe: [false], // defaut false
    });
  } 


  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          const step = this.authService.getFirstLoginStep();
          console.log("firstLoginStep BDD:", step);
          if (step === 1) {
            this.router.navigate(['/first-login/step-one']);
          } else if (step === 2) {
            this.router.navigate(['/first-login/step-two']);
          } else {
            this.router.navigate(['/user-profil']);
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('There was an error during the request (login)', error);
          if (error.status === 401) {
            this.errorMessage = 'Identifiants incorrects. Veuillez vérifier votre email et mot de passe.';
          } else {
            this.errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          }
        }
      });
    } else {
      console.error('Form is invalid');
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }


  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

}
