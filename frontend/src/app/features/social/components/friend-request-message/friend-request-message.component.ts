import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../../shared/services/utils/modal.service';

@Component({
  selector: 'app-friend-request-message',
  templateUrl: './friend-request-message.component.html',
  styleUrl: './friend-request-message.component.scss'
})
export class FriendRequestMessageComponent {

  messageForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
  ) {}

  ngOnInit():void {
    this.messageForm = this.fb.group({
      message: ['', [Validators.maxLength(100)]],
    });
  }

  confirmMessage(): void {
    if (this.messageForm.invalid) {
      return;
    }
    this.isLoading = true;

    this.modalService.close(
      {
        choice: true,
        message: this.messageForm.get('message')?.value
      }
    );
  }

  cancel(): void {
    this.messageForm.reset();
    this.modalService.close({
      choice: false,
      message: null
    });
  }
}
