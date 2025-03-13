import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomizationService {

    // dark-theme:
    private displayFishSubject: BehaviorSubject<boolean>;
    // light-thme:
    private isBgVideoSubject: BehaviorSubject<boolean>;

    constructor() {
        // x2 Lecture localStorage(string) lors de l'initialisation du service (si null -> default true)
        const savedToggleFish = localStorage.getItem('displayFish');
        this.displayFishSubject = new BehaviorSubject<boolean>(
            savedToggleFish !== null ? savedToggleFish === 'true' : true
        );
        const savedToggleBgVideo = localStorage.getItem('toggleBgVideo');
        this.isBgVideoSubject = new BehaviorSubject<boolean>(
            savedToggleBgVideo !== null ? savedToggleBgVideo === 'true' : true
        );
    }

    // *** Dark-theme toggle fishes:
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

    // *** Light-theme toggle Video:
    toggleBgVideo(): void {
        const newState = !this.isBgVideoSubject.value;
        this.isBgVideoSubject.next(newState);
        localStorage.setItem('toggleBgVideo', newState.toString()); // Pas de bool en localStorage
    }
    get isBgVideoState$(): Observable<boolean> {
        return this.isBgVideoSubject.asObservable();
    }


}
