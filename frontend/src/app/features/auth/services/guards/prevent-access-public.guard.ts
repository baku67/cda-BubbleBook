import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root'
})
export class PreventPublicAccessGuard implements CanActivate {

  constructor(
    private tokenService: TokenService, 
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = this.tokenService.getAccessToken();
    if (token) {
      // Utilisateur connecté, redirection vers /user-profil (TODO LANDING PAGE USER connected)
      this.router.navigate(['/user-profil']);
      return false;
    }

    // Utilisateur non connecté, accès autorisé
    return true;
  }
}