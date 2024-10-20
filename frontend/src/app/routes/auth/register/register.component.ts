import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// rxjs: debounce/throttlong input checkEmail:
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators'; // Import des opérateurs rxjs
// Customs:
import { passwordMatchValidator } from '../../../shared/error/passwordMatchValidator.directive';
import { EmailCheckService } from '../../../shared/services/auth/email-check-service.service';
import { EmailAsyncValidator } from '../../../shared/error/emailExistValidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  registerForm!: FormGroup;
  isLoading: boolean;
  emailExists = false;

  constructor(
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