import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Si le JWT est présent, l'accès est autorisé
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      return true;
    }

    // Sinon, redirection vers la page root (? TODO)
    this.router.navigate(['/']);
    return false;
  }
}
