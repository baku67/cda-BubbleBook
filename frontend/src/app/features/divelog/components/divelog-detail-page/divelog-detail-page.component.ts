import { Component } from '@angular/core';
import { UserDivelog } from '../../models/UserDivelog.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DIVELOG_THEMES, DivelogThemeOption } from '../../models/divelog-theme';
import { BackgroundService } from '../../../../shared/services/utils/background.service';
import { DivelogService } from '../../services/divelog.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { DivelogStoreService } from '../../services/divelog-detail-store.service';

@Component({
  selector: 'app-divelog-detail-page',
  templateUrl: './divelog-detail-page.component.html',
  styleUrl: './divelog-detail-page.component.scss',
})
export class DivelogDetailPageComponent {

  divelog: UserDivelog | null = null;

  themes: DivelogThemeOption[] = DIVELOG_THEMES;

  constructor(
    private backgroundService: BackgroundService,
    private divelogService: DivelogService,
    private divelogStore: DivelogStoreService, // cache pour partager le divelog avec les subRoutes
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const divelogId = this.route.snapshot.paramMap.get('id');
    if(!divelogId) {
      this.router.navigate(['/not-found']);
      return; 
    }

    this.divelogService.getCurrentUserDivelog(divelogId).pipe(
      tap(divelog => {
        if (!divelog) {
          this.router.navigate(['/not-found']);
        } else {
          this.divelog = divelog;
          this.divelogStore.setDivelog(divelog);
          // ** Modification de l'image de fond:
          this.backgroundService.setBgImage(this.getThemeImage(divelog.theme));
        }
      }),
      catchError(() => {
        this.router.navigate(['/not-found']);
        return EMPTY;
      })
    ).subscribe(); 
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
