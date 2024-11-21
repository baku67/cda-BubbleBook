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
    const initialLang = this.currentLangSubject.value;
    this.translate.setDefaultLang(initialLang);
    this.translate.use(initialLang);
  }

  switchLanguage(): void {
    const newLang = this.currentLangSubject.value === 'en-EN' ? 'fr-FR' : 'en-EN';
    this.currentLangSubject.next(newLang); // Émettre la nouvelle langue
    this.translate.use(newLang); // Appliquer la nouvelle langue avec ngx-translate
  }

  getCurrentLang(): string {
    return this.currentLangSubject.value; // Retourner la valeur courante du BehaviorSubject
  }
}
