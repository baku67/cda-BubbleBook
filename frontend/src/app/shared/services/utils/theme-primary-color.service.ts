import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemePrimaryColorService {
    private storageKey = 'primaryColor';

    constructor() {}

    // Applique la couleur stockée (appelé au démarrage dans appModule APP_INITIALIZER)
    applyStoredColor() {
        const savedColor = localStorage.getItem(this.storageKey) || "#3ec0ec"; 
        console.log('🌈 Couleur Dark-theme récupérée:', savedColor);
        this.setPrimaryColor(savedColor);
    }

    // Update color et localStorage
    setPrimaryColor(color: string) {
        localStorage.setItem(this.storageKey, color);

        document.documentElement.style.setProperty('--primary-color', color);
        document.body.style.setProperty('--primary-color', color);

        console.log('🌈 Couleur Dark-theme appliquée:', color);  
    }

    getStoredColor(): string {
        return localStorage.getItem('primaryColor') || "#3ec0ec";
    }
}
