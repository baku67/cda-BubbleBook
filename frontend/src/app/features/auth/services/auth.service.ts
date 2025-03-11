import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, delay, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { TokenService } from './token.service';
import { LoginData, RegisterData } from '../models/auth.types';
import { UserService } from '../../profil/services/user.service';

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

  private isInitializingAuth$ = new BehaviorSubject<boolean>(false);
  isInitializingAuthObservable = this.isInitializingAuth$.asObservable();

  private firstLoginStep: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private userService: UserService,
  ) {
    this.loggedIn$.next(this.tokenService.isAccessTokenValid());
  }

  // Inscription
  registerUser(registerData: RegisterData): Observable<unknown> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${environment.apiUrl}/api/register`, registerData, { headers });
  }

  // Connexion utilisateur
  login(credentials: LoginData): Observable<AuthResponse> {
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
        this.tokenService.setRememberMe(credentials.rememberMe);
        this.firstLoginStep = response.firstLoginStep;
        this.loggedIn$.next(true);

        // Force le rafraîchissement des données utilisateur
        this.userService.getCurrentUser(true).subscribe();
      })
    );
  }

  // Déconnexion
  logout(): void {
    this.isInitializingAuth$.next(true); // Active l'affichage du loader
    this.userService.clearCache();
    this.http.post(`${environment.apiUrl}/api/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        // Nettoyer les tokens et mettre à jour l'état de l'application
        this.tokenService.clearAccessToken();
        this.loggedIn$.next(false);
        this.router.navigate(['/login']); // Redirige vers la page de login
        setTimeout(() => this.isInitializingAuth$.next(false), 2000); // Désactive après un petit Délai minimum (friction positive pour l'écran de chargement)
      },
      error: (error) => {
        // console.warn('Erreur lors de la déconnexion, nettoyage local des tokens.');
        this.tokenService.clearAccessToken();
        this.loggedIn$.next(false);
        this.router.navigate(['/login']);      
        setTimeout(() => this.isInitializingAuth$.next(false), 2000); // Désactive après un petit Délai minimum (friction positive pour l'écran de chargement)
      }
    });
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
    this.isInitializingAuth$.next(true); // Active l'état d'initialisation

    const accessToken = this.tokenService.getAccessToken();
    const rememberMe = this.tokenService.getRememberMe();
  
    if (!accessToken) {
      if (rememberMe) {
        // console.log("Aucun accessToken trouvé, mais rememberMe activé. Tentative de rafraîchissement...");
        return this.refreshAccessToken().pipe(
          tap(() => {
            // console.log("Token rafraîchi avec succès")
          }),
          map(() => true),
          catchError(() => {
            // console.log("Échec du rafraîchissement du token");
            this.tokenService.clearAccessToken();
            this.loggedIn$.next(false);
  
            // On supprime aussi le refreshToken côté serveur
            return this.http.post(`${environment.apiUrl}/api/logout`, {}, { withCredentials: true }).pipe(
              catchError(() => of(null)),
              map(() => false)
            );
          }),
          tap(() => setTimeout(() => this.isInitializingAuth$.next(false), 2000)) // Délai minimum (friction positive pour l'écran de chargement) après un refresh réussi ou échec
        );
      } else {
        console.log("Aucun token et rememberMe désactivé. Utilisateur non authentifié.");
        this.isInitializingAuth$.next(false); // pas de délai minimal pour éviter un écran de chargement trop court
        // setTimeout(() => this.isInitializingAuth$.next(false), 10000); // test
        return of(false); 
      }
    }
  
    // Vérification de validité du token existant
    if (!this.tokenService.isAccessTokenValid()) {
      // console.log("Token expiré, tentative de rafraîchissement...");
  
      return this.refreshAccessToken().pipe(
        tap(() => {
          // console.log("Token rafraîchi avec succès")
        }),
        map(() => true),
        catchError(() => {
          // console.log("Échec du rafraîchissement du token");
          this.tokenService.clearAccessToken();
          this.loggedIn$.next(false);
  
          return this.http.post(`${environment.apiUrl}/api/logout`, {}, { withCredentials: true }).pipe(
            catchError(() => of(null)),
            map(() => false)
          );
        }),
        tap(() => setTimeout(() => this.isInitializingAuth$.next(false), 2000)) // // Délai minimum (friction positive pour l'écran de chargement) après un refresh réussi ou échec
      );
    }
  
    // console.log("Token valide, utilisateur authentifié");
    this.loggedIn$.next(true);
    this.isInitializingAuth$.next(false); // pas de délai minimal pour éviter un écran de chargement trop court
    // setTimeout(() => this.isInitializingAuth$.next(false), 10000); // test
    return of(true); 
  }
}
