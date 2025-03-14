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
import { TabTrackerService } from '../../services/utils/tab-tracker.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-bottom-mobile',
  standalone: true,
  imports: [MatIcon, MatMenu, MatMenuModule, CommonModule, RouterLink, RouterModule, TranslateModule, MatDividerModule],
  templateUrl: './nav-bottom-mobile.component.html',
  styleUrl: './nav-bottom-mobile.component.scss'
})
export class NavBottomMobileComponent {

  activeTabIndex$: Observable<number |null>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private langService: LanguageService,
    private tabTrackerService: TabTrackerService,
  ) {
    this.activeTabIndex$ = this.tabTrackerService.activeTabIndex$;
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
