import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DivelogService } from '../services/divelog.service';
import { UserDivelog } from '../models/UserDivelog.model';

@Injectable({
  providedIn: 'root'
})
export class UserDivelogResolver implements Resolve<UserDivelog | null> {

  constructor(private divelogService: DivelogService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserDivelog | null> {
    const divelogId = route.paramMap.get('id');

    if (!divelogId) {
      this.router.navigate(['/divelogs']); // ✅ Redirection si l'ID est manquant
      return EMPTY;
    }

    return this.divelogService.getCurrentUserDivelog(divelogId).pipe(
      tap(divelog => {
        if (!divelog) {
          this.router.navigate(['/not-found']); // ✅ Redirection si l'utilisateur n'est pas trouvé
        }
      }),
      catchError(() => {
        this.router.navigate(['/not-found']); // ✅ Redirection en cas d'erreur API
        return EMPTY;
      })
    );
  }
}
