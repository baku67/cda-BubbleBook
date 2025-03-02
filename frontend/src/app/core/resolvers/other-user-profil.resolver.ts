import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../../features/profil/services/user.service';
import { OtherUserProfil } from '../../features/social/models/OtherUserProfil';

@Injectable({
  providedIn: 'root'
})
export class UserProfileResolver implements Resolve<OtherUserProfil | null> {

  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OtherUserProfil | null> {
    const userId = route.paramMap.get('id');

    if (!userId) {
      return of(null); // ✅ Retourne `null` si aucun ID n’est présent
    }

    return this.userService.getOtherUserProfil(userId).pipe(
      catchError(() => of(null)) // ✅ En cas d'erreur, éviter le crash et retourner `null`
    );
  }
}
