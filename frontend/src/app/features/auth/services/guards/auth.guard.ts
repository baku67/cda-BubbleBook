import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private tokenService: TokenService, 
    private router: Router
  ) {}

  canActivate(): boolean {
    // Si le JWT est présent, l'accès est autorisé
    const token = this.tokenService.getAccessToken();
    if (token) {
      return true;
    }

    // Sinon, redirection vers la page root (? TODO)
    this.router.navigate(['/']);
    return false;
  }
}
