import { Component, ElementRef, ViewChild } from '@angular/core';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { UserDivelog } from '../../models/UserDivelog.model';
import { DivelogStoreService } from '../../services/divelog-detail-store.service';
import { filter } from 'rxjs';
import { DiveService } from '../../../dive/services/dive.service';
import { Dive } from '../../../dive/models/Dive.model';


@Component({
  selector: 'app-divelog-detail-overview',
  templateUrl: './divelog-detail-overview.component.html',
  styleUrl: './divelog-detail-overview.component.scss'
})
export class DivelogDetailOverviewComponent {

    divelog!: UserDivelog;
    divelogDives!: Dive[];

    isAnimatingFadeOut = false;

    @ViewChild('lottieLoadingWrapper', { static: false }) lottieLoadingWrapper!: ElementRef;

    constructor(
      private animationService: AnimationService,
      private divelogStore: DivelogStoreService,
      private diveService: DiveService,
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
          console.log('divelog reçu du store (cache):', this.divelog);
          this.diveService.getUserDivelogDives(d.id).subscribe(dives => {
            this.divelogDives = dives;
            console.log('dives:', this.divelogDives);
          });
        });
    }

    // Animation Loader global Lottie:
    optionsLoader: AnimationOptions = {
      path: '/assets/Lottie-animations/loader-water.json',
      loop: true,
      autoplay: true,
    };

    // Animation Carnet Lottie (couleurs dans CSS):
    optionsCarnet: AnimationOptions = {
      path: '/assets/Lottie-animations/trimmed-divelog.json',
      loop: false,
      autoplay: true,
    };
    animationCarnetCreated(anim: AnimationItem) {
      anim.addEventListener('DOMLoaded', () => {
        anim.playSegments([0, 85], true); // on selectionne que les frames d'apparition (https://app.lottiefiles.com/animation/7caf0d13-4151-41d2-b858-8910014a74e6?channel=web&source=public-animation&panel=embed&from=download)
      });
      anim.loop = false;
    }
}
