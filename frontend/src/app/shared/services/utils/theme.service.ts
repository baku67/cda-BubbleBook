import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme: 'light-theme' | 'dark-theme';

  constructor() {
    // Lecture du localStorage lors de l'initialisation du service
    const savedTheme = localStorage.getItem('theme') as 'light-theme' | 'dark-theme';
    this.currentTheme = savedTheme || 'dark-theme';

    // Application du thème lu ou du thème par défaut
    document.body.classList.add(this.currentTheme);
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    document.body.classList.remove(this.currentTheme);
    document.body.classList.add(newTheme);
    this.currentTheme = newTheme;
    localStorage.setItem('theme', this.currentTheme);
  }

  setTheme(theme: 'light-theme' | 'dark-theme'): void {
    document.body.classList.remove(this.currentTheme);
    document.body.classList.add(theme);
    this.currentTheme = theme;
    localStorage.setItem('theme', this.currentTheme);
  }

  getTheme(): string {
    return this.currentTheme
  }
}
