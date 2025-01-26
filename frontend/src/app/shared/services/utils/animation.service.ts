import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  private isAnimating = new BehaviorSubject<boolean>(false);
  isAnimating$ = this.isAnimating.asObservable();

  triggerFadeOut() {
    this.isAnimating.next(true);
  }

  resetAnimation() {
    this.isAnimating.next(false);
  }
}
