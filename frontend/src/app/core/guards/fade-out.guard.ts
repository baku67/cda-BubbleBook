import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { AnimationService } from '../../shared/services/utils/animation.service';

export interface CanDeactivateComponent {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class FadeOutGuard implements CanDeactivate<CanDeactivateComponent> {
  constructor(private animationService: AnimationService) {}

  canDeactivate(): Observable<boolean> {
    // Déclencher l'animation de fadeOut
    this.animationService.triggerFadeOut();

    // Délai pour anim CSS
    return of(true).pipe(
      // /!\ Penser à modifier le délai de fade-out CSS
      delay(400), 
      tap(() => this.animationService.resetAnimation())
    );
  }
}
