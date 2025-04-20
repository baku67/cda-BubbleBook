import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// Stocke l'index de l'onglet navBottom actif selon des groupes de routes
// Stocké en SessionStorage pour garder l'info même lors d'un refresh du navigateur (volontaire ou post-veille) mais on le garde pas lors de la fermeture comme le ferai un localStorage
// Gère aussi les effet de navigation immédiatement aux clicks (et non à la fin de NavigationEnd)
export class TabTrackerService {

  private activeTabIndex = new BehaviorSubject<number | null>(this.getStoredTabIndex());
  activeTabIndex$ = this.activeTabIndex.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveTab(event.urlAfterRedirects);
      }
    });
  }

  /**
   * Déclenche immédiatement l'index pour l'effet de slide AVANT la navigation
   */  
  public setActiveTabIndex(index: number | null): void {
    this.activeTabIndex.next(index);
    this.storeTabIndex(index);
  }

  /**
   * Utilisé uniquement pour synchroniser si l'utilisateur navigue autrement qu'avec les boutons
   */
  private updateActiveTab(url: string) {
    const tabMapping: { [index: number]: string[] } = {
      0: ['/certificates', '/user-profil'],
      1: ['/divelogs'],
      2: ['/social'],
      3: ['/account-settings'],
    };

    let matchedIndex: number | null = null;
    
    Object.entries(tabMapping).forEach(([index, routes]) => {
      if (routes.some(route => url.startsWith(route))) {
        matchedIndex = parseInt(index, 10);
      }
    });

    // Mise à jour seulement si différent (évite des déclenchements inutiles)
    if (matchedIndex !== this.activeTabIndex.value) {
      this.activeTabIndex.next(matchedIndex);
      this.storeTabIndex(matchedIndex);
    }
  }

  /**
   * Stocke l'index actif en sessionStorage (utile pour reload ou retour arrière)
   */
  private storeTabIndex(index: number | null) {
    if (index !== null) {
      sessionStorage.setItem('activeTabIndex', index.toString());
    } else {
      sessionStorage.removeItem('activeTabIndex');
    }
  }

  private getStoredTabIndex(): number | null {
    const storedIndex = sessionStorage.getItem('activeTabIndex');
    return storedIndex !== null ? parseInt(storedIndex, 10) : null;
  }
}
