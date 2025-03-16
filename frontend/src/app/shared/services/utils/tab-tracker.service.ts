import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { routes } from '../../../app.routes';

@Injectable({
  providedIn: 'root',
})
// Stocke l'index de l'onglet navBottom actif selon des groupes de routes
// Stocké en SessionStorage pour garder l'info même lors d'un refresh du navigateur (volontaire ou post-veille) mais on le garde pas lors de la fermeture comme le ferai un localStorage
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

  // Pour onClickNav index immédiat BGslide avant NavigationEnd qui est délayé
  public setActiveTabIndex(index: number | null): void {
    this.activeTabIndex.next(index);
    this.storeTabIndex(index);
  }

  private updateActiveTab(url: string) {
    const tabMapping: { [index: number]: string[] } = {
      0: ['/certificates', '/user-profil'],
      1: ['/user-divelog'],
      2: ['/social'],
      3: ['/account-settings'],
    };

    let matchedIndex: number | null = null;
    
    Object.entries(tabMapping).forEach(([index, routes]) => {
      if (routes.some(route => url.startsWith(route))) {
        matchedIndex = parseInt(index, 10);
      }
    });

    this.activeTabIndex.next(matchedIndex);
    this.storeTabIndex(matchedIndex);
  }

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
