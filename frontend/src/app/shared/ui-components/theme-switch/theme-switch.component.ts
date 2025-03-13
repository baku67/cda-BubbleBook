import { Component } from '@angular/core';
import { ThemeService } from '../../services/utils/theme.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { ThemeType } from '../../models/ThemeType.model';

@Component({
  selector: 'app-theme-switch',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './theme-switch.component.html',
  styleUrl: './theme-switch.component.scss'
})
export class ThemeSwitchComponent {

  currentTheme$: Observable<ThemeType>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.currentTheme$;
  }
  toggleTheme() {
    this.themeService.toggleTheme(); 
  }

}
