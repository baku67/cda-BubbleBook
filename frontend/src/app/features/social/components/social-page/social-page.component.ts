import { Component } from '@angular/core';
import { AnimationService } from '../../../../shared/services/utils/animation.service';

@Component({
  selector: 'app-social-page',
  templateUrl: './social-page.component.html',
  styleUrl: './social-page.component.scss'
})
export class SocialPageComponent {

  isAnimatingFadeOut = false;

      constructor(
        private animationService: AnimationService
      ) {
        this.animationService.isAnimating$.subscribe((animating) => {
          this.isAnimatingFadeOut = animating;
        });
      }

}
