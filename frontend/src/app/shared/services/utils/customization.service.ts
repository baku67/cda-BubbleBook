import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomizationService {

  private displayFishSubject: BehaviorSubject<boolean>;

  constructor() {
    // Lecture localStorage(string) lors de l'initialisation du service (si null -> default true)
    const savedToggleFish = localStorage.getItem('displayFish');
    this.displayFishSubject = new BehaviorSubject<boolean>(
      savedToggleFish !== null ? savedToggleFish === 'true' : true
    );
  }

  // Fade-out auquarium avant de toggle ? (pas besoin de fadeIn parce que poissons pop hors-champ)
  toggleDisplayFish(): void {
    const newState = !this.displayFishSubject.value;
    this.displayFishSubject.next(newState);
    localStorage.setItem('displayFish', newState.toString()); // Pas de bool en localStorage
  }

  // Permet le delai pour .fadeOut dans VideoComponent avant false
  get displayFishState$(): Observable<boolean> {
    return this.displayFishSubject.asObservable();
  }
  get currentDisplayFishState(): boolean {
    return this.displayFishSubject.value;
  }

}
