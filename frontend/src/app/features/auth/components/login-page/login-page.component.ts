import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit{

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private router: Router,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Ici les validateurs synchrones doivent être dans un tableau
      password: ['', [Validators.required]], // 
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

}
