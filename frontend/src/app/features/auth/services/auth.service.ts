import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Simule la récupération du JWT depuis le localStorage ou autre moyen de stockage
  getToken(): string | null {
    return localStorage.getItem('jwtToken');  // Récupère le token JWT du localStorage (ou de ton propre mécanisme)
  }

  // Méthode pour enregistrer le token lors de la connexion
  setToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  // Méthode pour supprimer le token lors de la déconnexion
  clearToken(): void {
    localStorage.removeItem('jwtToken'); 
  }
}
