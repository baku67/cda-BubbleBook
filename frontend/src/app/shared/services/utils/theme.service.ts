import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ThemeType } from '../../models/ThemeType.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private themeSubject: BehaviorSubject<ThemeType>;

  constructor() {
    // Lecture du localStorage lors de l'initialisation du service
    const savedTheme = (localStorage.getItem('theme') as ThemeType) || 'light-theme';
    this.themeSubject = new BehaviorSubject<ThemeType>(savedTheme);

    // ajout theme sur body
    document.body.classList.add(savedTheme);
  }

  toggleTheme(): void {
    const newTheme: ThemeType = this.themeSubject.value === 'light-theme' ? 'dark-theme' : 'light-theme';
    document.body.classList.replace(this.themeSubject.value, newTheme);
    this.themeSubject.next(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  setTheme(theme: ThemeType): void {
    if (this.themeSubject.value !== theme) {
      document.body.classList.replace(this.themeSubject.value, theme);
      this.themeSubject.next(theme);
      localStorage.setItem('theme', theme);
    }
  }

  get currentTheme$(): Observable<ThemeType> {
    return this.themeSubject.asObservable();
  }

  getTheme(): ThemeType {
    return this.themeSubject.value;
  }
}
