import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ModalService } from '../../../../shared/services/utils/modal.service';

@Component({
  selector: 'app-confirm-delete-account',
  templateUrl: './confirm-delete-account.component.html',
  styleUrl: './confirm-delete-account.component.scss'
})
export class ConfirmDeleteAccountComponent {

  confirmationForm!: FormGroup;
  confirmationSentence: string = "Je supprime mon compte";

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService
  ) {}

  ngOnInit():void {
    this.confirmationForm = this.fb.group({
      confirmation: ['', [
        Validators.required,
        this.mustMatchTitleValidator.bind(this)
      ]]
    });
  }

  private mustMatchTitleValidator(ctrl: AbstractControl): ValidationErrors | null {
    return ctrl.value === this.confirmationSentence
      ? null
      : { titleMismatch: true };
  }

  confirmDelete(): void {
    this.modalService.close(true); 
  }

  cancel(): void {
    this.modalService.close(false);
  }
}
