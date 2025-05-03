import { Component } from '@angular/core';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { ActivatedRoute } from '@angular/router';
import { UserDivelog } from '../../models/UserDivelog.model';

@Component({
  selector: 'app-divelog-detail-overview',
  templateUrl: './divelog-detail-overview.component.html',
  styleUrl: './divelog-detail-overview.component.scss'
})
export class DivelogDetailOverviewComponent {

    /** Carnet récupéré par le resolver */
    divelog: UserDivelog | null = null;

    isAnimatingFadeOut = false;
  
    constructor(
      private route: ActivatedRoute,
      private animationService: AnimationService,
    ) {
      this.animationService.isAnimating$.subscribe((animating) => {
        this.isAnimatingFadeOut = animating;
      });
    }

    ngOnInit(): void {
      // Récup du divelog snapshot du composant parent (qui récupère du resolver):
      this.divelog = this.route.parent!.snapshot.data['divelog'];
      // ** ou réactif:
      // this.route.parent!.data
      // .subscribe(({ divelog }) => this.divelog = divelog);
      // }
    }
}
