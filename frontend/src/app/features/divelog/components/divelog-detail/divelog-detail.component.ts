import { Component } from '@angular/core';
import { DivelogService } from '../../services/divelog.service';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { TranslateService } from '@ngx-translate/core';
import { UserDivelog } from '../../models/UserDivelog.model';
import { ActivatedRoute } from '@angular/router';
import { DIVELOG_THEMES, DivelogThemeOption } from '../../models/divelog-theme';

@Component({
  selector: 'app-divelog-detail',
  templateUrl: './divelog-detail.component.html',
  styleUrl: './divelog-detail.component.scss'
})
export class DivelogDetailComponent {

  /** Carnet récupéré par le resolver */
  divelog: UserDivelog | null = null;

  themes: DivelogThemeOption[] = DIVELOG_THEMES;

  isAnimatingFadeOut = false;

  constructor(
    private route: ActivatedRoute,
    private divelogService: DivelogService,
    private animationService: AnimationService,
    private translateService: TranslateService,
  ) {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }

  ngOnInit(): void {
    this.divelog = this.route.snapshot.data['divelog'];
  }

  // Récup url des Couvertures des divelogs:
  getThemeImage(themeId: string): string {
    const theme = this.themes.find(t => t.id === themeId);
    return theme ? theme.imageUrl : '';
  }
}
