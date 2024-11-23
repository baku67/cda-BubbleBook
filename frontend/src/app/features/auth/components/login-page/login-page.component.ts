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
          this.router.navigate(['/user-profil']);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('There was an error during the request (login)', error);
          this.errorMessage = 'Login failed. Please check your credentials.';
          this.isLoading = false;
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
