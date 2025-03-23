import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ThemeService } from './theme.service';

@Injectable({
    providedIn: 'root'
})
export class ThemePrimaryColorService {
    private storageKey = 'primaryColor';

    constructor(private themeService: ThemeService) {
        this.themeService.currentTheme$.subscribe(theme => {
            if (theme === 'light-theme') {
              this.clearPrimaryColor();
            } else {
              // Réappliquer la couleur si déjà stockée
              const stored = this.getStoredColor();
              if (stored) {
                this.setPrimaryColor(stored);
              }
            }
        });
    }

    // Applique la couleur stockée (appelé au démarrage dans appModule APP_INITIALIZER)
    applyStoredColor() {
        const savedColor = localStorage.getItem(this.storageKey);
        if (savedColor) {
          this.setPrimaryColor(savedColor);
        }
      }

    // Update color et localStorage
    setPrimaryColor(color: string) {
        localStorage.setItem(this.storageKey, color);
      
        const currentTheme = this.themeService.getTheme();
        if (currentTheme === 'dark-theme') {
          document.documentElement.style.setProperty('--primary-color', color);
          document.body.style.setProperty('--primary-color', color);
          console.log('🌈 Couleur dark appliquée:', color);
        } else {
          console.log('🌈 Thème clair actif – couleur ignorée');
        }
      }

    getStoredColor(): string {
        return localStorage.getItem('primaryColor') || "#3ec0ec";
    }

    // Pour quand on toggle le light-theme (évite d'avoir a recharger la page pour enlever la couleur custom)
    clearPrimaryColor() {
        document.documentElement.style.removeProperty('--primary-color');
        document.body.style.removeProperty('--primary-color');
        console.log('🌈 Couleur personnalisée supprimée (retour au thème clair)');
    }
}
