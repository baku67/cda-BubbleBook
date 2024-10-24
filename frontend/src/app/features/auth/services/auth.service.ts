import { Injectable } from '@angular/core';

interface DecodedToken {
  exp?: number;  // Le champ exp représente la date d'expiration en secondes depuis Epoch
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // *************************************************
  // TODO: A revoir (mettre le token dans sessionStorage)

  // Simule la récupération du JWT depuis le localStorage ou autre moyen de stockage
  getToken(): string | null {
    return sessionStorage.getItem('jwtToken');  // Récupère le token JWT du localStorage (ou de ton propre mécanisme)
  }

  // Méthode pour enregistrer le token lors de la connexion
  setToken(token: string): void {
    sessionStorage.setItem('jwtToken', token);
  }

  // Méthode pour supprimer le token lors de la déconnexion
  clearToken(): void {
    sessionStorage.removeItem('jwtToken'); 
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    sessionStorage.removeItem('jwtToken');  // Supprime le token stocké dans le localStorage
  }



  // *********************************************
  // EXPIRATION TOKEN:
  logoutIfTokenExpired(): void {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      const expirationDate = this.getTokenExpirationDate(token);
      if (expirationDate && expirationDate < new Date()) {
        this.logout();
      }
    }
  }
  
  getTokenExpirationDate(token: string): Date | null {
    const decodedToken = this.decodeToken(token);
    if (decodedToken && decodedToken.exp) {
      const date = new Date(0); 
      date.setUTCSeconds(decodedToken.exp);
      return date;
    }
    return null;
  }
  
  decodeToken(token: string): DecodedToken | null {
    try {
      // Utilisation de `as DecodedToken` pour que TypeScript sache que le résultat est un `DecodedToken`
      return JSON.parse(atob(token.split('.')[1])) as DecodedToken;
    } catch {
      return null;
    }
  }
}
