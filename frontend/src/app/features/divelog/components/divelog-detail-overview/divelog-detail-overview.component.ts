import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { UserDivelog } from '../../models/UserDivelog.model';
import { DivelogStoreService } from '../../services/divelog-detail-store.service';
import { filter } from 'rxjs';


@Component({
  selector: 'app-divelog-detail-overview',
  templateUrl: './divelog-detail-overview.component.html',
  styleUrl: './divelog-detail-overview.component.scss'
})
export class DivelogDetailOverviewComponent {

    divelog!: UserDivelog;

    isAnimatingFadeOut = false;

    @ViewChild('lottieLoadingWrapper', { static: false }) lottieLoadingWrapper!: ElementRef;

    constructor(
      private animationService: AnimationService,
      private divelogStore: DivelogStoreService,
    ) {
      this.animationService.isAnimating$.subscribe((animating) => {
        this.isAnimatingFadeOut = animating;
      });
    }

    ngOnInit(): void {
      this.divelogStore.divelog$
        .pipe(filter(d => d !== null))
        .subscribe(d => {
          this.divelog = d!;
          console.log('divelog reçu sans resolver:', this.divelog);
        });
    }


    // Animation Loader global Lottie:
    optionsLoader: AnimationOptions = {
      path: '/assets/Lottie-animations/loader-water.json',
      loop: true,
      autoplay: true,
    };
    animationLoaderCreated(anim: AnimationItem) {
      setTimeout(() => {
        const svgEl: SVGElement | null =
          this.lottieLoadingWrapper.nativeElement.querySelector('svg');
        if (svgEl) {
          svgEl.querySelectorAll('[fill]').forEach(el =>
            // // COULEUR SYNC .SCSS
            (el as SVGElement).setAttribute('fill', '#00ffc3') // /!\ synchro avec app.component.scss:.loading-screen-title
          );
        }
      }, 0);
    }

    // Animation Carnet Lottie (couleurs dans CSS):
    optionsCarnet: AnimationOptions = {
      path: '/assets/Lottie-animations/trimmed-divelog.json',
      loop: false,
      autoplay: true,
    };
    animationCarnetCreated(anim: AnimationItem) {
      anim.addEventListener('DOMLoaded', () => {
        anim.playSegments([0, 85], true);
  
      });
      anim.loop = false;
    }
}
