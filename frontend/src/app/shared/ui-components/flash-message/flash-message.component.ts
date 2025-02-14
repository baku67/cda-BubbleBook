import { CommonModule } from '@angular/common';
import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-flash-message',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './flash-message.component.html',
  styleUrl: './flash-message.component.scss'
})
export class FlashMessageComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() matIcon?: 'check_circle' | 'warning' | 'info' | null = null;
  @Input() isVisible: boolean = true; // Géré par le service

  @HostBinding('class') get hostClass(): string {
    return this.type;
  }

  @HostBinding('class.visible') isVBisible: boolean = true;
  @HostListener('click')
  onClick(): void {
    this.isVisible = false;  // Masque le message lorsque l'utilisateur clique dessus
    setTimeout(() => this.removeMessage(), 500); // Supprime après une animation
  }

  private removeMessage(): void {
    this.message = ''; // Éventuellement émettre un événement pour informer le parent
  }
}
