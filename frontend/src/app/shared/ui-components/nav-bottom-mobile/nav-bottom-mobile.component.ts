import { Component, Input } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../services/utils/theme.service';
import { LanguageService } from '../../services/utils/language.service';

@Component({
  selector: 'app-nav-bottom-mobile',
  standalone: true,
  imports: [MatIcon, MatMenu, MatMenuModule, CommonModule, RouterLink, TranslateModule],
  templateUrl: './nav-bottom-mobile.component.html',
  styleUrl: './nav-bottom-mobile.component.scss'
})
export class NavBottomMobileComponent {

  @Input() isLoggedIn!: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private langService: LanguageService,
  ) {}

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
}
