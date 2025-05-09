import { Component, Input } from '@angular/core';
import { UserDivelog } from '../../models/UserDivelog.model';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ModalService } from '../../../../shared/services/utils/modal.service';

@Component({
  selector: 'app-divelog-confirmation-delete',
  templateUrl: './divelog-confirmation-delete.component.html',
  styleUrl: './divelog-confirmation-delete.component.scss'
})
export class DivelogConfirmationDeleteComponent {

  @Input() divelogToDelete!: UserDivelog;

  confirmationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService
  ) {}

  ngOnInit():void {
    // Initialiser le formulaire avec le validateur custom "mustMatchTitle"
    this.confirmationForm = this.fb.group({
      confirmation: ['', [
        Validators.required,
        this.mustMatchTitleValidator.bind(this)
      ]]
    });
  }

  /** Validator qui vérifie que l'input === title du divelog */
  private mustMatchTitleValidator(ctrl: AbstractControl): ValidationErrors | null {
    return ctrl.value === this.divelogToDelete.title
      ? null
      : { titleMismatch: true };
  }

  /** Appelé quand l’utilisateur clique sur « Supprimer » */
  confirmDelete(): void {
    this.modalService.close(true); 
  }

  /** Appelé quand l’utilisateur clique sur « Annuler » */
  cancel(): void {
    this.modalService.close(false);
  }
}
