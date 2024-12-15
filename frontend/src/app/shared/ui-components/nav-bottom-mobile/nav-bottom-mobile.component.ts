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
  // Pour rendre actif le bouton-onglet:
  isSettingsRouteActive: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private langService: LanguageService,
  ) {}

  ngOnInit() {
    // Écoute des changements de route, pour rendre actif le bouton-onglet:
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isSettingsRouteActive = this.checkIfRouteIsActive(event.urlAfterRedirects);
      }
    });
  }

  // Pour rendre actif le bouton-onglet:
  checkIfRouteIsActive(url: string): boolean {
    // routes pour lesquelles on veut que le bouton soit actif
    const activeRoutes = ['/account-settings'];
    return activeRoutes.some(route => url.startsWith(route));
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
