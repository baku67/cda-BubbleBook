import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme: 'light-theme' | 'dark-theme' = 'dark-theme';

  toggleTheme(): void {
    const newTheme = this.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    document.body.classList.remove(this.currentTheme);
    document.body.classList.add(newTheme);
    this.currentTheme = newTheme;
  }

  setTheme(theme: 'light-theme' | 'dark-theme'): void {
    document.body.classList.remove(this.currentTheme);
    document.body.classList.add(theme);
    this.currentTheme = theme;
  }

  getTheme(): string {
    return this.currentTheme
  }
}
