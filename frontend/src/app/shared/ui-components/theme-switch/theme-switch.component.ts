import { Component } from '@angular/core';
import { ThemeService } from '../../services/utils/theme.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-theme-switch',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './theme-switch.component.html',
  styleUrl: './theme-switch.component.scss'
})
export class ThemeSwitchComponent {

  constructor(private themeService: ThemeService) {};

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  get currentTheme() {
    return this.themeService.getTheme();
  }

}
