import { Component, OnInit } from '@angular/core';
import { UserProfil } from '../../models/userProfile.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { FormControl } from '@angular/forms';
import { FirstLoginStepsService } from '../../../first-login-steps/services/first-login-steps.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent implements OnInit {

    user?:UserProfil;

    visibilityControl = new FormControl(false);  // Par défaut à "Privé"
  
    isUserLoading = true;
  
    emailConfirmResent = false;
    emailConfirmResentLoading = false;

    isAnimatingFadeOut = false;

    constructor(
      private userService: UserService, 
      private firstLoginService: FirstLoginStepsService,
      private authService: AuthService,
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

    updateVisibility(isPublicParam: boolean): void {
      this.firstLoginService.updateUser({...this.user, isPublic: isPublicParam}).subscribe({
        next: () => console.log('Visibilité du profil mise à jour, isPublic: ', isPublicParam),
        error: (error) => console.error('Erreur lors de la mise à jour de la visibilité', error)
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
