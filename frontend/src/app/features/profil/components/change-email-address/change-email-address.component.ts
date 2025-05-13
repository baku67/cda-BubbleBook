import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../../shared/services/utils/modal.service';
import { UserService } from '../../services/user.service';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-email-address',
  templateUrl: './change-email-address.component.html',
  styleUrl: './change-email-address.component.scss'
})
export class ChangeEmailAddressComponent {

    changeEmailForm!: FormGroup;
    isLoading = false;
  
    constructor(
      private fb: FormBuilder,
      private modalService: ModalService,
      private userService: UserService,
      private flashMessageService: FlashMessageService,
    ) {}
  
    ngOnInit():void {
      this.changeEmailForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
      });
    }

    confirmEmailChange(): void {
      if (this.changeEmailForm.invalid) {
        return;
      }
      this.isLoading = true;
  
      this.userService.updateEmailAddress(this.changeEmailForm.get("email")?.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.flashMessageService.success("Email modifié avec succès");
          this.modalService.close(true);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          if(err.status == 409) {
            this.flashMessageService.error("Cette adresse e-mail est déjà utilisée.");
          }
          else if(err.status == 400) {
            this.flashMessageService.error("Nouvelle adresse invalide ou identique à l’actuelle.");
          }
          else {
            this.flashMessageService.error("Erreur lors de la modification de l'adresse mail");
          }
          this.modalService.close(false);
        }
      });
    }
  
    cancel(): void {
      this.changeEmailForm.reset();
      this.modalService.close(false);
    }
}
