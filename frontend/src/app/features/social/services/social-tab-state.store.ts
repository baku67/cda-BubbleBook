import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocialTabStateService {
  private readonly STORAGE_KEY = 'socialTabIndex';
  private _tabIndex = new BehaviorSubject<number>(this.readFromStorage());
  readonly tabIndex$ = this._tabIndex.asObservable();

  /** Récupère l’index dans le localStorage ou 0 par défaut */
  private readFromStorage(): number {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw !== null ? Number(raw) : 0;
  }

  /** Met à jour l’index et persiste dans localStorage */
  set(index: number) {
    this._tabIndex.next(index);
    localStorage.setItem(this.STORAGE_KEY, index.toString());
  }
}
