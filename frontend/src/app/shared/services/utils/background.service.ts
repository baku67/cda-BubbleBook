import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BackgroundService {
  private bgImageSubject = new BehaviorSubject<string>('assets/images/backgrounds/kelp.jpg');
  bgImage$ = this.bgImageSubject.asObservable();

  /** Met à jour l’image de fond */
  // (appelé dans le composant divelog-detail pour le changement de fond en fonction du thème du carnet, puis réinitialisé dans le composant navBottom au moment du preSlide plutot que dans le OnDestroy de divelog-details)
  setBgImage(path: string) {
    this.bgImageSubject.next(path);
  }
}