import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { TokenService } from './token.service';

interface AuthResponse {
  accessToken: string;
  firstLoginStep: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn$.asObservable();

  private firstLoginStep: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.loggedIn$.next(this.tokenService.hasValidToken());
  }

  // Connexion utilisateur
  login(credentials: { email: string; password: string; rememberMe: boolean }): Observable<AuthResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(
        `${environment.apiUrl}/api/login`, 
        credentials,
        { 
          headers,
          withCredentials: true
        }
      ).pipe(
      tap((response: AuthResponse) => {
        this.tokenService.setAccessToken(response.accessToken);
        this.firstLoginStep = response.firstLoginStep;
        this.loggedIn$.next(true);
      })
    );
  }

  // Déconnexion
  logout(): void {
    this.http.post(`${environment.apiUrl}/api/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        // Nettoyer les tokens et mettre à jour l'état de l'application
        this.tokenService.clearAccessToken();
        this.loggedIn$.next(false);
        this.router.navigate(['/login']); // Redirige vers la page de login
      },
      error: (error) => {
        console.warn('Erreur lors de la déconnexion, nettoyage local des tokens.');
        this.tokenService.clearAccessToken();
        this.loggedIn$.next(false);
        this.router.navigate(['/login']);      }
    });
  }

  // Inscription
  registerUser(registerData: unknown): Observable<unknown> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${environment.apiUrl}/api/register`, registerData, { headers });
  }

  // Renvoi d'email de confirmation
  resendConfirmationEmail(email: string): Observable<unknown> {
    const url = `${environment.apiUrl}/api/resend-confirmation`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, { email }, { headers });
  }

  // Vérification du statut de connexion
  getFirstLoginStep(): number | null {
    return this.firstLoginStep;
  }

  refreshAccessToken(): Observable<string> {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/api/refresh-token`, {}, { withCredentials: true }).pipe(
      tap((response) => {
        this.tokenService.setAccessToken(response.token);
        this.loggedIn$.next(true);
      }),
      map((response) => response.token)
    );
  }

  initializeAuthSync(): Promise<boolean> {
    return this.initializeAuth().toPromise().then(result => result ?? false);
  }

  initializeAuth(): Observable<boolean> {
    return this.refreshAccessToken().pipe(
      tap(() => {
        console.log('Token rafraîchi avec succès');
      }),
      map(() => true), // Utilisateur authentifié
      catchError(() => {
        console.log('Échec du rafraîchissement du token');
        this.tokenService.clearAccessToken(); // Supprimer les données si nécessaire
        this.loggedIn$.next(false);
        return of(false); // Échec de l'authentification
      })
    );
  }
}
