import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // Récupération du JWT (accessToken) depuis le sessionStorage
  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  // Enregistrer les tokens dans le storage
  setTokens(accessToken: string): void {
    sessionStorage.setItem('accessToken', accessToken);
  }

  // Supprimer les tokens lors de la déconnexion
  clearTokens(): void {
    sessionStorage.removeItem('accessToken');
  }
}
