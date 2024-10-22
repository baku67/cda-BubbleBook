import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environments';
import { AuthService } from '../../../shared/services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

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

      // Loader/Spinner
      this.isLoading = true;
      this.errorMessage = null; // Réinitialiser le message d'erreur

      // Envoi de la requête POST au serveur pour le login
      this.http.post<{ token: string }>(`${environment.apiUrl}/api/login`, this.loginForm.value)
        .subscribe({
          next: (response) => {
            // Stocker le token JWT dans le localStorage (<--> auth.service)
            this.authService.setToken(response.token);

            // Redirection vers le tableau de bord ou autre page sécurisée
            this.router.navigate(['/user-profil']);

            // Désactiver le loader
            this.isLoading = false;
          },
          error: (error) => {
            // Gérer les erreurs de la requête
            console.error('There was an error during the request (login)', error);
            this.errorMessage = 'Login failed. Please check your credentials.';
            this.isLoading = false; // Désactiver le loader
          }
        });
      } else {
        console.error('Form is invalid');
        this.errorMessage = 'Please fill in all required fields correctly.';
        this.isLoading = false; // Désactiver le loader
      }
    }

}
