import { ChangeDetectorRef, Component, Input, signal, ViewChild } from '@angular/core';
import { UserProfil } from '../../models/userProfile.model';
import { UserService } from '../../services/user.service';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ModalService } from '../../../../shared/services/utils/modal.service';
import { ChangeEmailAddressComponent } from '../change-email-address/change-email-address.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ConfirmDeleteAccountComponent } from '../confirm-delete-account/confirm-delete-account.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-settings-profil',
  templateUrl: './account-settings-profil.component.html',
  styleUrl: './account-settings-profil.component.scss'
})
export class AccountSettingsProfilComponent {
    @ViewChild(MatExpansionPanel) panel!: MatExpansionPanel; // pour ouvrir automatiquement le panel Profil selon router.nav (ici depuis le userCard)

    @Input() user!: UserProfil;

    readonly panelOpenState = signal(false);

    emailConfirmResent = false;
    emailConfirmResentLoading = false;

    isAccountDeleting = false;

    constructor(
      private route: ActivatedRoute,
      private cdr: ChangeDetectorRef,
      private authService: AuthService,
      private userService: UserService, 
      private modalService: ModalService,
      private flashMessageService: FlashMessageService
    ) {}

    ngAfterViewInit() {
      this.route.fragment.subscribe(fragment => {
        if (fragment === 'profil') {
          this.panel.open();
          this.cdr.detectChanges(); // stabilisation de la vue (marche sans mais bon)
        }
      });
    }
  
    resendConfirmationEmail(userEmail: string): void {
      if (!userEmail) return; // Empêche d'appeler l'API si `userEmail` est `null`
    
      this.emailConfirmResentLoading = true;
      
      this.authService.resendConfirmationEmail(userEmail).subscribe({
        next: (response) => {
          this.emailConfirmResentLoading = false;
          this.emailConfirmResent = true;
          this.flashMessageService.success("Email de confirmation renvoyé");
        },
        error: (error) => {
          this.emailConfirmResentLoading = false;
          this.flashMessageService.error("Impossible de renvoyer le mail de confirmation");
        }
      });
    }

    public openModalChangeEmailAddress() {
      this.modalService.open(ChangeEmailAddressComponent, {
        modalIcon: 'alternate_email'
      })

      // Si succss: on recharge le User et met à jour en cache
      this.modalService.subscribeToClose((result: boolean) => {
        if(result) {
          this.userService.refreshUser();
        }
      });
    }

    public openModalChangePassword() {
      this.modalService.open(ChangePasswordComponent, {
        modalIcon: 'password'
      })
      // requete envoyée depuis le modal (et gestion d'erreur/flashMsg)
    }

    public openModalDeleteAccount() {
      this.isAccountDeleting = true;
      this.modalService.open(ConfirmDeleteAccountComponent, {
        modalIcon: 'warning'
      })

      // (Gestion du mismatch du retappage dans le modal)
      this.modalService.subscribeToClose((choice: boolean) => {
        if(choice) {
          this.userService.deleteUserAccount().subscribe({
            next: () => {
              this.authService.logout();
            },
            error: () => {
              this.isAccountDeleting = false;
              console.error('Erreur lors de la suppression du compte');
              this.flashMessageService.error("Erreur lors de la suppression du compte");
            },
          });
        }
        else {
          this.isAccountDeleting = false;
        }
      });
    }
}
