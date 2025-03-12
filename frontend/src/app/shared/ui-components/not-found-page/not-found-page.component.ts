import { Component } from '@angular/core';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { AnimationService } from '../../services/utils/animation.service';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [PageHeaderComponent, TranslateModule],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss'
})
export class NotFoundPageComponent {

  isAnimatingFadeOut = false;

  constructor(
    private animationService: AnimationService,
  ) {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }
}
