import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface FlashMessage {
    message: string;
    type: 'success' | 'error' | 'info';
    matIcon: 'check_circle' | 'warning' | 'info';
    isVisible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FlashMessageService {
  private messageSubject = new BehaviorSubject<FlashMessage  | null>(null);

  getMessage() {
    return this.messageSubject.asObservable();
  }

  showMessage(message: string, type: 'success' | 'error' | 'info' = 'info', matIcon: 'check_circle' | 'warning' | 'info'): void {
    const flashMessage: FlashMessage = { message, type, matIcon, isVisible: true };
    this.messageSubject.next(flashMessage);

    // Planifie la disparition après 3 secondes
    setTimeout(() => {
      this.hideMessage();
    }, 3000);
  }

  hideMessage(): void {
    const currentMessage = this.messageSubject.value;
    if (currentMessage) {
      this.messageSubject.next({ ...currentMessage, isVisible: false });
    }

    // Supprime complètement le message après une animation de 500ms
    setTimeout(() => {
      this.messageSubject.next(null);
    }, 500);
  }
}
