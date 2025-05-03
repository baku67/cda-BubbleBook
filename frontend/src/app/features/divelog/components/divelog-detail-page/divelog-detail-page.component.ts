import { Component } from '@angular/core';
import { UserDivelog } from '../../models/UserDivelog.model';
import { ActivatedRoute } from '@angular/router';
import { DIVELOG_THEMES, DivelogThemeOption } from '../../models/divelog-theme';
import { BackgroundService } from '../../../../shared/services/utils/background.service';

@Component({
  selector: 'app-divelog-detail-page',
  templateUrl: './divelog-detail-page.component.html',
  styleUrl: './divelog-detail-page.component.scss'
})
export class DivelogDetailPageComponent {

  /** Carnet récupéré par le resolver */
  divelog: UserDivelog | null = null;

  themes: DivelogThemeOption[] = DIVELOG_THEMES;

  constructor(
    private route: ActivatedRoute,
    private backgroundService: BackgroundService,
  ) {}

  ngOnInit(): void {
    this.divelog = this.route.snapshot.data['divelog'];
    // Modification de l'image de fond
    if(this.divelog) {
      this.backgroundService.setBgImage(this.getThemeImage(this.divelog.theme));
    }
  }

  // Récup url des Couvertures des divelogs:
  getThemeImage(themeId: string): string {
    const theme = this.themes.find(t => t.id === themeId);
    return theme ? theme.imageUrl : '';
  }

  ngOnDestroy(): void {
    // ** Remettre l'image de fond par défaut
    // ** Logique déplacée dans le navBottomMobile triggerBackgroundPreSlide()
    // this.backgroundService.setBgImage('assets/images/backgrounds/kelp.jpg');
  }
}
