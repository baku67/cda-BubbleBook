import { Component } from '@angular/core';
import { AnimationService } from '../../../../shared/services/utils/animation.service';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  isAnimatingFadeOut = false;

  constructor(
    private animationService: AnimationService
  ) {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }

  
}
