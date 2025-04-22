import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalService } from '../../services/utils/modal.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @ViewChild('modalContent', { read: ViewContainerRef, static: true }) viewContainerRef!: ViewContainerRef;

  @Input() modalIcon?: string;

  constructor(private modalService: ModalService) {}

  close(): void {
    this.modalService.close();
  }
}
