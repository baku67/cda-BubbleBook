import { Component, OnInit } from '@angular/core';
import { UserProfil } from '../../models/userProfile.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { FirstLoginStepsService } from '../../../first-login-steps/services/first-login-steps.service';
import { PrivacyOption, PrivacyOptionHelper } from '../../../../shared/models/privacy-option';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent implements OnInit {

    user?:UserProfil;

    privacyOptions = PrivacyOptionHelper.getOptions();
    selectedPrivacyOption: PrivacyOption = PrivacyOption.NO_ONE;

    isUserLoading = true;
  
    emailConfirmResent = false;
    emailConfirmResentLoading = false;

    isAnimatingFadeOut = false;

    constructor(
      private userService: UserService, 
      private firstLoginService: FirstLoginStepsService,
      private authService: AuthService,
      private flashMessageService: FlashMessageService,
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
          this.selectedPrivacyOption = this.convertToPrivacyOption(userData.profilPrivacy) || PrivacyOption.NO_ONE;
        },
        error: (error: unknown) => {
          console.error('Erreur lors de la récupération du profil utilisateur', error);
          this.isUserLoading = false;
        }
      });
    }

    private convertToPrivacyOption(value: string): PrivacyOption | undefined {
      return Object.values(PrivacyOption).find(option => option === value);
    }

    // TODO: updateUser dans UserService
    onPrivacyOptionChange(newOption: PrivacyOption): void {
      console.log('Nouvelle option de confidentialité :', newOption);
      this.selectedPrivacyOption = newOption;
      this.firstLoginService.updateUser({ ...this.user, profilPrivacy: newOption }).subscribe({
        next: () => {
          console.log('Profil mis à jour');
          // Affiche un FlashMessage succès
          this.flashMessageService.showMessage('Votre profil a été mis à jour avec succès !', "success");
        },
        error: (err) => {
          console.error('Erreur de mise à jour du profil :', err);
          // Affiche un FlashMessage erreur
          this.flashMessageService.showMessage('Erreur lors de la mise à jour de votre profil.', "error");
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
