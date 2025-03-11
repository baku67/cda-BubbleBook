import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from '../../features/profil/services/user.service';
import { OtherUserProfil } from '../../features/social/models/other-user-profil.model';

@Injectable({
  providedIn: 'root'
})
export class OtherUserProfileResolver implements Resolve<OtherUserProfil | null> {

  constructor(private userService: UserService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OtherUserProfil | null> {
    const userId = route.paramMap.get('id');

    if (!userId) {
      this.router.navigate(['/social']); // ✅ Redirection si l'ID est manquant
      return EMPTY;
    }

    return this.userService.getOtherUserProfil(userId).pipe(
      tap(user => {
        if (!user) {
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
