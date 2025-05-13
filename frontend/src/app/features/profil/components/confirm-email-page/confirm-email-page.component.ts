import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environments';
import { AnimationService } from '../../../../shared/services/utils/animation.service';

@Component({
  selector: 'app-confirm-email-page',
  templateUrl: './confirm-email-page.component.html'
})
export class ConfirmEmailPageComponent implements OnInit {

  isLoading = true;
  confirmSuccess = false;
  emailAddress = "";

  isAnimatingFadeOut = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private animationService: AnimationService,
  ) {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }

  ngOnInit(): void {
    // Récupérer le token depuis l'URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      this.emailAddress = params['emailAddress'];
      const isChangingEmailAddress = params['changingEmail'] === 'true';

      if (!token) {
        this.router.navigate(['/']);
        return;
      }

      if (isChangingEmailAddress) {
        // route de changement d'email
        this.http.get(
          `${environment.apiUrl}/api/user/email/confirm?token=${token}`
        ).subscribe({
          next: () => {
            this.isLoading = false;
            this.confirmSuccess = true;
            // éventuellement redirect vers login
          },
          error: () => {
            this.isLoading = false;
            this.confirmSuccess = false;
          }
        });
      } else {
        // route d'inscription
        this.http.get(
          `${environment.apiUrl}/api/confirm-email?token=${token}`
        ).subscribe({
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
    });
  }

}