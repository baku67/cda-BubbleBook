import { Component, OnInit } from '@angular/core';
import { UserProfil } from '../../models/userProfile.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { Observable } from 'rxjs';
import { ThemeType } from '../../../../shared/models/ThemeType.model';
import { ThemeService } from '../../../../shared/services/utils/theme.service';
import { CustomizationService } from '../../../../shared/services/utils/customization.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent implements OnInit {

    user$!: Observable<UserProfil | null>;

    isUserLoading = true;
  
    emailConfirmResent = false;
    emailConfirmResentLoading = false;

    currentTheme$: Observable<ThemeType>;
    displayFish$!: Observable<boolean>;

    isAnimatingFadeOut = false;

    constructor(
      private userService: UserService, 
      private authService: AuthService,
      private animationService: AnimationService,
      private themeService: ThemeService,
      private customizationService: CustomizationService,
    ) {
      this.animationService.isAnimating$.subscribe((animating) => {
        this.isAnimatingFadeOut = animating;
      });
      this.currentTheme$ = this.themeService.currentTheme$;
      this.displayFish$ = this.customizationService.displayFishState$;
    }

    ngOnInit(): void { 
      this.user$ = this.userService.getCurrentUser();
    }

    resendConfirmationEmail(userEmail: string): void {
      if (!userEmail) return; // Empêche d'appeler l'API si `userEmail` est `null`
    
      this.emailConfirmResentLoading = true;
      
      this.authService.resendConfirmationEmail(userEmail).subscribe({
        next: (response) => {
          console.log('Email de confirmation renvoyé:', response);
          this.emailConfirmResentLoading = false;
          this.emailConfirmResent = true;
        },
        error: (error) => {
          console.error('Erreur lors de la régénération du token:', error);
          this.emailConfirmResentLoading = false;
          alert('Impossible d\'envoyer l\'email de confirmation. Veuillez réessayer plus tard.');
        }
      });
    }

    toggleFishDisplay(): void {
      this.customizationService.toggleDisplayFish();
    }
    
}
