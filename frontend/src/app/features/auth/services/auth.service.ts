import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { TokenService } from './token.service';



interface DecodedToken {
  exp?: number;  // Le champ exp représente la date d'expiration en secondes depuis Epoch
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false); // Initialisation à false par défaut
  // Observable pour savoir si l'utilisateur est connecté
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router, private tokenService: TokenService) {
    // Initialisation après que TokenService soit injecté
    this.loggedIn.next(this.hasToken());
    // Vérifie s'il y a un refreshToken au démarrage
    // this.checkRefreshTokenOnStartup();
  }

  private checkRefreshTokenOnStartup(): void {
    const refreshToken = this.tokenService.getRefreshToken();
    if (refreshToken && !this.hasToken()) {
      this.refreshAccessToken().subscribe({
        next: () => {
          this.loggedIn.next(true);
        },
        error: () => {
          console.warn('Échec de la régénération de l\'accessToken, mais on garde le refreshToken');
        }
      });
    }
  }

  private hasToken(): boolean {
    const token = this.tokenService.getAccessToken();
    if (!token) {
      return false;
    }

    const expirationDate = this.getTokenExpirationDate(token);
    return !!expirationDate && expirationDate > new Date();
  }

  getAccessToken(): string | null {
    return this.tokenService.getAccessToken();
  }

  getRefreshToken(): string | null {
    return this.tokenService.getRefreshToken();
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.tokenService.setTokens(accessToken, refreshToken);
    this.loggedIn.next(true);
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.loggedIn.next(false);
  }




  registerUser(registerData: unknown): Observable<unknown> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${environment.apiUrl}/api/register`,
       registerData,
       { headers }
    );
  }
  // Connexion et enregistrement des tokens
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/api/login`,
      credentials,
      { headers }
    ).pipe(
      tap((response: AuthResponse) => {
        this.setTokens(response.accessToken, response.refreshToken);
      })
    );
  }
  // Auto-login après inscription
  autoLoginAfterRegister(email: string, password: string): void {
    this.login({ email, password }).subscribe({
      next: () => {
        this.router.navigate(['/first-login/step-one']);
      },
      error: (error) => {
        console.error('Auto-login failed', error);
      }
    });
  }




  refreshAccessToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      console.warn('Aucun refreshToken trouvé.');
      return new Observable();
    }

    // Envoi du refreshToken dans le body:
    // return this.http.post<AuthResponse>(`${environment.apiUrl}/api/refresh-token`, { refreshToken }, {}).pipe(
    //   tap((response: AuthResponse) => {
    //     if (response && response.accessToken) {
    //       this.tokenService.setTokens(response.accessToken, refreshToken);
    //     }
    //   }),
    //   catchError((error) => {
    //     console.error('Erreur lors du rafraîchissement du token', error);
    //     return throwError(() => new Error('Erreur lors du rafraîchissement du token'));
    //   })
    // );

    // Envoi du refreshToken dans le Header avec "Authorization" et "Bearer <token>":
    // Configuration des headers pour inclure le token avec le format Authorization: Bearer <token>
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}`
    });

    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/api/refresh-token`,
      {},
      { headers } // Ajout des headers dans la requête
    ).pipe(
      tap((response: AuthResponse) => {
        if (response && response.accessToken) {
          this.tokenService.setTokens(response.accessToken, refreshToken);
        }
      }),
      catchError((error) => {
        console.error('Erreur lors du rafraîchissement du token', error);
        return throwError(() => new Error('Erreur lors du rafraîchissement du token'));
      })
    );
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
      return JSON.parse(atob(token.split('.')[1])) as DecodedToken;
    } catch {
      return null;
    }
  }
}
