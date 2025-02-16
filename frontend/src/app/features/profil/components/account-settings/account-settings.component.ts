import { Component, OnInit, signal } from '@angular/core';
import { UserProfil } from '../../models/userProfile.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { PrivacyOption, PrivacyOptionHelper } from '../../models/privacy-option';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent implements OnInit {

    readonly panelOpenState = signal(false);

    user?:UserProfil;

    privacyOptionsEnum = PrivacyOption;
    privacyOptions = PrivacyOptionHelper.getOptions();

    selectedProfilPrivacyOption: PrivacyOption = this.privacyOptionsEnum.NO_ONE;
    selectedLogBooksPrivacyOption: PrivacyOption = this.privacyOptionsEnum.NO_ONE;
    selectedCertificatesPrivacyOption: PrivacyOption = this.privacyOptionsEnum.NO_ONE;
    selectedGalleryPrivacyOption: PrivacyOption = this.privacyOptionsEnum.NO_ONE;

    isUserLoading = true;
    isRequestSending = false;
  
    emailConfirmResent = false;
    emailConfirmResentLoading = false;

    isAnimatingFadeOut = false;

    constructor(
      private userService: UserService, 
      private authService: AuthService,
      private flashMessageService: FlashMessageService,
      private animationService: AnimationService,
      private translateService: TranslateService,
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
          this.selectedProfilPrivacyOption = this.convertToPrivacyOption(userData.profilPrivacy) || PrivacyOption.NO_ONE;
          this.selectedLogBooksPrivacyOption = this.convertToPrivacyOption(userData.logBooksPrivacy) || PrivacyOption.NO_ONE;
          this.selectedCertificatesPrivacyOption = this.convertToPrivacyOption(userData.certificatesPrivacy) || PrivacyOption.NO_ONE;
          this.selectedGalleryPrivacyOption = this.convertToPrivacyOption(userData.galleryPrivacy) || PrivacyOption.NO_ONE;
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
  
    // Attention: Quand on revient sur profil = NO_ONE => IL FAUT toggle le reste en no_one aussi (ou alors bien géré le back)
    onPrivacyOptionChange(section: string, newOption: PrivacyOption): void {
      this.isRequestSending = true;
      
      this.userService.updateUserPrivacy({ ...this.user, [`${section}Privacy`]: newOption }).subscribe({
        next: (updatedUser: UserProfil) => {
          this.user = updatedUser;
          this.isRequestSending = false;

          // Recalcule les options de confidentialité à partir de `this.user`
          this.selectedProfilPrivacyOption = this.convertToPrivacyOption(updatedUser.profilPrivacy) || PrivacyOption.NO_ONE;
          this.selectedLogBooksPrivacyOption = this.convertToPrivacyOption(updatedUser.logBooksPrivacy) || PrivacyOption.NO_ONE;
          this.selectedCertificatesPrivacyOption = this.convertToPrivacyOption(updatedUser.certificatesPrivacy) || PrivacyOption.NO_ONE;
          this.selectedGalleryPrivacyOption = this.convertToPrivacyOption(updatedUser.galleryPrivacy) || PrivacyOption.NO_ONE;
          
          this.translateService.get('PROFILE_UPDATE_SUCCESS').subscribe((message: string) => {
            this.flashMessageService.showMessage(message, 'success', 'check_circle');
          });
        },
        error: () => {
          this.isRequestSending = false;
          this.translateService.get('PROFILE_UPDATE_ERROR').subscribe((message: string) => {
            this.flashMessageService.showMessage(message, 'error', 'warning');
          });
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
