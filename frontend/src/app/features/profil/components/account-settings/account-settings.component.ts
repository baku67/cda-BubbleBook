import { Component } from '@angular/core';
import { UserProfil } from '../../models/userProfile.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { AnimationService } from '../../../../shared/services/utils/animation.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent {

    user?:UserProfil;
  
    isUserLoading = true;
  
    emailConfirmResent = false;
    emailConfirmResentLoading = false;

    isAnimatingFadeOut = false;

    constructor(
      private userService: UserService, 
      private authService: AuthService,
      private router: Router,
      private animationService: AnimationService
    ) {
      this.animationService.isAnimating$.subscribe((animating) => {
        this.isAnimatingFadeOut = animating;
      });
    }

    ngOnInit(): void { 
      this.userService.getCurrentUser().subscribe({ 
        next: (userData: UserProfil) => {
          this.user = userData;
          this.isUserLoading = false;
        },
        error: (error: unknown) => {
          console.error('Erreur lors de la récupération du profil utilisateur', error);
          this.isUserLoading = false;
        }
      });
    }

    resendConfirmationEmail(): void {
      if(!this.user?.isVerified) {
  
        this.emailConfirmResentLoading = true;
        
        this.authService.resendConfirmationEmail(this.user!.email).subscribe(
          response => {
            console.log('Email de confirmation renvoyé:', response);
            this.emailConfirmResentLoading = false;
            this.emailConfirmResent = true;
          },
          error => {
            console.error('Erreur lors de la régénération du token:', error);
            this.emailConfirmResentLoading = false;
            alert('Impossible d\'envoyer l\'email de confirmation. Veuillez réessayer plus tard.');
          }
        );
      }
    }
}
