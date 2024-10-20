import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      is2fa: [false],
      roles: [['user']],
      isVerified: [false]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.http.post('http://localhost:8000/api/register', this.registerForm.value)
        .subscribe(
          (response) => {
            console.log('User registered successfully', response);
            this.router.navigate(['/login']); // Redirection après succès
          },
          (error) => {
            console.error('There was an error during the request', error);
          }
        );
    } else {
      console.error('Form is invalid');
    }
  }
}