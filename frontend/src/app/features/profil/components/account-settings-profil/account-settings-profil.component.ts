import { Component, Input, signal } from '@angular/core';
import { UserProfil } from '../../models/userProfile.model';
import { UserService } from '../../services/user.service';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-account-settings-profil',
  templateUrl: './account-settings-profil.component.html',
  styleUrl: './account-settings-profil.component.scss'
})
export class AccountSettingsProfilComponent {

    @Input() user!: UserProfil;

    readonly panelOpenState = signal(false);

    emailConfirmResent = false;
    emailConfirmResentLoading = false;

    constructor(
      private authService: AuthService,
      private userService: UserService, 
      private flashMessageService: FlashMessageService
    ) {}
  
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
}
