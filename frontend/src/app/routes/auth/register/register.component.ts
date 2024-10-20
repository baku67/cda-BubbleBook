import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { passwordMatchValidator } from '../../../shared/error/passwordMatchValidator.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading: boolean;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordCheck: ['', [Validators.required]],
      is2fa: [false], // Todo: false par defaut et demandé sur prochain écran (les 2-3 premiers login)
      roles: [['user']],
      isVerified: [false]
    }, { validator: passwordMatchValidator });

    this.isLoading = false;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {

      // Loader/Spinner
      this.isLoading = true;

      this.http.post('http://localhost:8000/api/register', this.registerForm.value)
        .subscribe(
          (response) => {
            console.log('User registered successfully', response);
            this.router.navigate(['/login']); // Redirection après succès (TODO: login() auto + /profil)
          },
          (error) => {
            console.error('There was an error during the request (register)', error);
          }
        );
    } else {
      console.error('Form is invalid');
    }
  }
}