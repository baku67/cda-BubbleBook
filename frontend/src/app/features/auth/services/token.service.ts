import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly ACCESS_TOKEN_KEY = 'accessToken';

  // Récupération du JWT depuis le sessionStorage
  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // Stocker le JWT dans le storage
  setAccessToken(token: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  // Supprimer le JWT 
  clearAccessToken(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  // Vérifie si un token valide existe
  hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    const expirationDate = this.getTokenExpirationDate(token);
    return !!expirationDate && expirationDate > new Date();
  }

  // Obtenir la date d'expiration du token
  private getTokenExpirationDate(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (decoded?.exp) {
      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return date;
    }
    return null;
  }
  // Décoder le token JWT pour en extraire les informations
  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  // Gestion du refresh token dans un cookie HTTP-only (sans accès depuis JS)
  setRefreshTokenCookie(): void {
    // Les refresh tokens sont directement gérés par le serveur via des cookies.
    // Assurez-vous que votre backend envoie le refresh token avec HttpOnly.
  }
}
