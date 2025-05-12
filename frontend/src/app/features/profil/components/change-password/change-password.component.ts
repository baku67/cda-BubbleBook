import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../../shared/services/utils/modal.service';
import { passwordComplexityValidator } from '../../../../shared/validators/passwordComplexityValidator';
import { passwordMatchValidator } from '../../../../shared/validators/passwordMatchValidator';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {

  changePasswordForm!: FormGroup;
  hideCurrPassword = true;
  hideNewPassword = true;
  hideNewPassword2 = true;
  passwordComplexityScore = 0;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private userService: UserService,
    private authService: AuthService,
    private flashMessageService: FlashMessageService,
    private translateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit():void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordCheck: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  toggleCurrPasswordVisibility(): void {
    this.hideCurrPassword = !this.hideCurrPassword;
  }
  toggleNewPasswordVisibility(): void {
    this.hideNewPassword = !this.hideNewPassword;
  }
  toggleNewPassword2Visibility(): void {
    this.hideNewPassword2 = !this.hideNewPassword2;
  }

  // passwordComplexityValidator.ts  (jauge mot de passe)
  onPasswordInput(): void {
    const passwordControl = this.changePasswordForm.get('password');
    if (passwordControl) {
      const errors = passwordComplexityValidator()(passwordControl);
      if (errors && errors['passwordComplexityScore'] !== undefined) {
        this.passwordComplexityScore = errors['passwordComplexityScore'];
      } else {
        this.passwordComplexityScore = 0;
      }
    }
  }

  get passwordStrengthColor(): string {
    if (this.passwordComplexityScore <= 2) {
      return 'weak'; // Rouge
    } else if (this.passwordComplexityScore <= 4) {
      return 'medium'; // Jaune
    } else {
      return 'strong'; // Vert
    }
  }

  get passwordErrorMessage(): string | null {
    const passwordControl = this.changePasswordForm.get('password');

    if (passwordControl?.hasError('required')) {
      return this.translateService.instant('PASSWORD_REQUIRED');
    }

    if (passwordControl?.hasError('minlength')) {
      return this.translateService.instant('PASSWORD_MIN_LENGTH', { minLength: 8 });
    }
    return null;
  }


  confirmPasswordChange(): void {
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.isLoading = true;
    const { currentPassword, password: newPassword } = this.changePasswordForm.value;

    this.userService.updatePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.flashMessageService.success("Mot de passe modifié avec succès");
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.isLoading = false;
        if(err.status === 400) {
          this.flashMessageService.error("Mot de passe actuel incorrect.");
          this.modalService.close();
        }
        else {
          this.flashMessageService.error("Erreur lors de la modification du mot de passe");
          this.modalService.close();
        }
      }
    });
  }

  cancel(): void {
    this.changePasswordForm.reset();
    this.modalService.close();
  }
}


