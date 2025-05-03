import { Component, Inject, Optional } from '@angular/core';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { DivelogDetailPageComponent } from '../divelog-detail-page/divelog-detail-page.component';
import { DIVELOG_DETAIL_PAGE } from '../../injection-tokens/divelog-detail-page.token';

@Component({
  selector: 'app-divelog-detail-overview',
  templateUrl: './divelog-detail-overview.component.html',
  styleUrl: './divelog-detail-overview.component.scss'
})
export class DivelogDetailOverviewComponent {

    isAnimatingFadeOut = false;
  
    constructor(
      @Optional()
      @Inject(DIVELOG_DETAIL_PAGE)
      public parent: DivelogDetailPageComponent, // Récupération du composant parent pour récup le divelog
      private animationService: AnimationService,
    ) {
      this.animationService.isAnimating$.subscribe((animating) => {
        this.isAnimatingFadeOut = animating;
      });
    }

    ngOnInit(): void {}
}
