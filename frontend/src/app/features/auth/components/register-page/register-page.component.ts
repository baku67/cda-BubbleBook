import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
  checkEmail() {
    const email = this.registerForm.get('email')?.value;
    if (email) {
      this.emailCheckService.checkEmailExists(email).subscribe((response) => {
        this.emailExists = response.exists;
      });
    }
  }
}