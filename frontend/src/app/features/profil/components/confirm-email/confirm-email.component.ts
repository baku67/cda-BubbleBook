import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html'
})
export class ConfirmEmailComponent implements OnInit {

  isLoading = true;
  confirmSuccess = false;
  emailAddress = "";

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer le token depuis l'URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      this.emailAddress = params['emailAddress'];
      if (token && params['emailAddress']) {
        // Envoyer une requête au backend pour confirmer l'email
        this.http.get(`http://localhost:8000/api/confirm-email?token=${token}`)
          .subscribe({
            next: () => {
              this.isLoading = false;
              this.confirmSuccess = true;
            },
            error: () => {
              this.isLoading = false;
              this.confirmSuccess = false;
            }
          });
      }
      else {
        this.router.navigate(['/']);
      }
    });
  }

  resendConfirmationEmail(): void {
    this.authService.resendConfirmationEmail(this.emailAddress).subscribe(
      response => {
        console.log('Email de confirmation renvoyé:', response);
        alert('Un email de confirmation a été envoyé, vérifiez votre boîte de réception.');
      },
      error => {
        console.error('Erreur lors de la régénération du token:', error);
        alert('Impossible d\'envoyer l\'email de confirmation. Veuillez réessayer plus tard.');
      }
    );
  }

}