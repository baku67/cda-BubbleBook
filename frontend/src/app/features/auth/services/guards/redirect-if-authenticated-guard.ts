import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';  

@Injectable({
  providedIn: 'root'
})
export class RedirectIfAuthenticatedGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getAccessToken();
    if (token) {
      // Utilisateur connecté, redirection vers /user-profil (TODO LANDING PAGE USER connected)
      this.router.navigate(['/user-profil']);
      return false;
    }

    // Utilisateur non connecté, accès autorisé
    return true;
  }
}