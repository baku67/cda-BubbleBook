import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environments';

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
  ) {}

  ngOnInit(): void {
    // Récupérer le token depuis l'URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      this.emailAddress = params['emailAddress'];
      if (token && params['emailAddress']) {
        // Envoyer une requête au backend pour confirmer l'email
        this.http.get(`${environment.apiUrl}/api/confirm-email?token=${token}`)
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

}