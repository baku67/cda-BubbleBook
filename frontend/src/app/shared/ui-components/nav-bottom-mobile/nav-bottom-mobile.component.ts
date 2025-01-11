import { Component, Input } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { Router, NavigationEnd, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../services/utils/theme.service';
import { LanguageService } from '../../services/utils/language.service';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-nav-bottom-mobile',
  standalone: true,
  imports: [MatIcon, MatMenu, MatMenuModule, CommonModule, RouterLink, RouterModule, TranslateModule, MatDividerModule],
  templateUrl: './nav-bottom-mobile.component.html',
  styleUrl: './nav-bottom-mobile.component.scss'
})
export class NavBottomMobileComponent {

  @Input() isLoggedIn!: boolean;
  // Pour rendre actif le bouton-onglet selon la route actuelle:
  isSettingsRouteActive = false;
  isProfilRouteActive = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private langService: LanguageService,
  ) {}

  ngOnInit() {
    // Écoute des changements de route, pour rendre actif les boutons-onglets selon les sub-routes:
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isSettingsRouteActive = this.checkIfRouteIsActive(['/account-settings']);
        this.isProfilRouteActive = this.checkIfRouteIsActive(['/certificates', '/user-profil']);
      }
    });
  }

  // Pour rendre actif un des boutons-onglets:
  /**
   * Vérifie si l'une des routes données est active.
   * @param routeChecked Tableau des routes à vérifier.
   * @returns true si l'une des routes est active.
   */
  private checkIfRouteIsActive(routesToCheck: string[]): boolean {
    // Utilise l'URL actuelle (après redirections)
    const currentUrl = this.router.url;
  
    // Vérifie si l'URL actuelle correspond à l'une des routes
    return routesToCheck.some(route => currentUrl.startsWith(route));
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Rediriger vers la landinPage
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
