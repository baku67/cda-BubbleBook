import { Component, Input } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { Router, NavigationEnd, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../services/utils/theme.service';
import { LanguageService } from '../../services/utils/language.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-nav-bottom-mobile',
  standalone: true,
  imports: [MatIcon, MatMenu, MatMenuModule, CommonModule, RouterLink, RouterModule, TranslateModule, MatDividerModule],
  templateUrl: './nav-bottom-mobile.component.html',
  styleUrl: './nav-bottom-mobile.component.scss'
})
export class NavBottomMobileComponent {

  isProfilRouteActive = false;
  isSocialRouteActive = false;
  isSettingsRouteActive = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private langService: LanguageService,
  ) {}

  ngOnInit() {
    this.isProfilRouteActive = this.checkIfRouteIsActive(['/certificates', '/user-profil']);
    this.isSocialRouteActive = this.checkIfRouteIsActive(['/social']);
    this.isSettingsRouteActive = this.checkIfRouteIsActive(['/account-settings']);

    // Mise à jour automatique lors des changements de route
    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
            this.isProfilRouteActive = this.checkIfRouteIsActive(['/certificates', '/user-profil']);
            this.isSocialRouteActive = this.checkIfRouteIsActive(['/social']); 
            this.isSettingsRouteActive = this.checkIfRouteIsActive(['/account-settings']);
        }
    });
}


  private checkIfRouteIsActive(routesToCheck: string[]): boolean {
    const currentUrl = this.router.url;
    // Vérifie si l'URL actuelle correspond à l'une des routes
    return routesToCheck.some(route => currentUrl.startsWith(route));
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

  navigateAccountSettings(): void {
    this.router.navigate(['/account-settings']); 
  }
}
