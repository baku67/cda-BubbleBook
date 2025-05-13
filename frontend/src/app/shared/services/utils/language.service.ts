import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root' 
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<string>('fr-FR'); // BehaviorSubject pour la langue courante
  public currentLang$: Observable<string> = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('language') || 'fr-FR';
    this.currentLangSubject.next(savedLang);
    this.translate.setDefaultLang(savedLang);
    this.translate.use(savedLang);
  }

  switchLanguage(): void {
    const newLang = this.currentLangSubject.value === 'en-EN' ? 'fr-FR' : 'en-EN';
    this.currentLangSubject.next(newLang); // Émettre la nouvelle langue
    this.translate.use(newLang); // Appliquer la nouvelle langue avec ngx-translate
    localStorage.setItem('language', newLang);
  }

  public setLanguage(lang: string): void {
    this.currentLangSubject.next(lang);
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  getCurrentLang(): string {
    return this.currentLangSubject.value; // Retourner la valeur courante du BehaviorSubject
  }
}
