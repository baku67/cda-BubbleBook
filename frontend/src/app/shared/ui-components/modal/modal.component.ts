import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalService } from '../../services/utils/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @ViewChild('modalContent', { read: ViewContainerRef, static: true }) viewContainerRef!: ViewContainerRef;

  constructor(private modalService: ModalService) {}

  close(): void {
    this.modalService.close();
  }
}
