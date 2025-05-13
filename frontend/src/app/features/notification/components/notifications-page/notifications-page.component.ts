import { Component } from '@angular/core';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent {

    isAnimatingFadeOut = false;

    constructor(
      private animationService: AnimationService,
      private flashMessageService: FlashMessageService,
    ) {
      this.animationService.isAnimating$.subscribe((animating) => {
        this.isAnimatingFadeOut = animating;
      });
    }
}
