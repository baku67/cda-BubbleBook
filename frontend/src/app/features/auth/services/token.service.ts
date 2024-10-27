import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // Récupération du JWT (accessToken) depuis le sessionStorage
  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  // Récupération du refreshToken depuis le localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Enregistrer les tokens dans le storage
  setTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Supprimer les tokens lors de la déconnexion
  clearTokens(): void {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
