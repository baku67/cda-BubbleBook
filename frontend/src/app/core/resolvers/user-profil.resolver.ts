import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../../features/profil/services/user.service';
import { UserProfil } from '../../features/profil/models/userProfile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileResolver implements Resolve<UserProfil | null> {

  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserProfil | null> {
    return this.userService.getCurrentUser().pipe(
      catchError(() => of(null)) // En cas d'erreur, retourne `null`
    );
  }
}
