import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserDivelog } from '../models/UserDivelog.model';

@Injectable({ providedIn: 'root' })
export class DivelogStoreService {
    
  private subject = new BehaviorSubject<UserDivelog | null>(null);
  divelog$ = this.subject.asObservable();

  /** Appelé par le parent pour publier le divelog */
  setDivelog(divelog: UserDivelog): void {
    this.subject.next(divelog);
  }
}