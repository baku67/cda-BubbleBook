import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang: string = 'fr-FR'; // Langue par défaut

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.currentLang);
    this.translate.use(this.currentLang);
  }

  switchLanguage(): void {
    this.currentLang = this.currentLang === 'en-EN' ? 'fr-FR' : 'en-EN';
    this.translate.use(this.currentLang);
  }

  getCurrentLang(): string {
    return this.currentLang;
  }
}
