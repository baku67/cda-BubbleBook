import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../services/utils/theme.service';
import { LanguageService } from '../../services/utils/language.service';
import { MatDividerModule } from '@angular/material/divider';
import { TabTrackerService } from '../../services/utils/tab-tracker.service';
import { Observable } from 'rxjs';
import { BackgroundService } from '../../services/utils/background.service';

@Component({
  selector: 'app-nav-bottom-mobile',
  standalone: true,
  imports: [MatIcon, MatMenu, MatMenuModule, CommonModule, RouterLink, RouterModule, TranslateModule, MatDividerModule],
  templateUrl: './nav-bottom-mobile.component.html',
  styleUrl: './nav-bottom-mobile.component.scss'
})
export class NavBottomMobileComponent implements OnInit {

  activeTabIndex$: Observable<number |null>;
  translateValue = '0%'; 

  @Input({required: true}) isMobileOrTablet!: boolean; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private langService: LanguageService,
    private backgroundService: BackgroundService,
    private tabTrackerService: TabTrackerService,
  ) {
    this.activeTabIndex$ = this.tabTrackerService.activeTabIndex$;
  }

  ngOnInit() {
    // Surveille les changements d'onglet
    this.activeTabIndex$.subscribe(index => {
      if (index !== null) {
        // Calcule la translation selon l’index
        this.translateValue = (index * 100) + '%';
      } else {
        this.translateValue = '0%';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  switchTheme(): void {
    this.themeService.toggleTheme();
  }

  switchLang(): void {
    this.langService.switchLanguage();
  }

  triggerBackgroundPreSlide(tabIndex: number): void {
    this.tabTrackerService.setActiveTabIndex(tabIndex);
    // et reset du img src background (voir le composant divelog-detail, anciennement onDestroy):
    this.backgroundService.setBgImage('assets/images/backgrounds/kelp.jpg');
  }

  navigateAccountSettings(): void {
    this.triggerBackgroundPreSlide(3);
    this.router.navigate(['/account-settings']); 
  }
}
