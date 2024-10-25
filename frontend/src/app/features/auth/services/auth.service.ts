import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environments';



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

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken()); // (BehaviorSubject: derniere valeure)
  // Observable pour savoir si l'utilisateur est connecté
  isLoggedIn$ = this.loggedIn.asObservable();


  constructor(private http: HttpClient, private router: Router) {
      // Vérifie s'il y a un refreshToken au démarrage
      this.checkRefreshTokenOnStartup();
  }

  // Vérifie s'il y a un refreshToken au démarrage de l'application
  private checkRefreshTokenOnStartup(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken && !this.hasToken()) {
      this.refreshAccessToken().subscribe({
        next: () => {
          this.loggedIn.next(true);
        },
        error: () => {
          console.warn('Échec de la régénération de l\'accessToken, mais on garde le refreshToken');
          // this.logout();
        }
      });
    }
  }

  // Récupération du JWT (accessToken) depuis le sessionStorage
  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  // Récupération du refreshToken depuis le localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Méthode pour enregistrer les tokens lors de la connexion
  setTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.loggedIn.next(true);

    // console.log()
  }

  // Vérifie si un utilisateur est connecté
  private hasToken(): boolean {
    return !!this.getAccessToken();
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    this.clearTokens();
  }
  // Méthode pour supprimer les tokens lors de la déconnexion
  clearTokens(): void {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.loggedIn.next(false);
  }



  // ******************************************** 
  // (LoginPageComponent et RegisterPageComponent)
  // REGISTER, LOGIN, at auto-login après register
  // Enregistre un utilisateur via l'API
  registerUser(registerData: unknown): Observable<unknown> {
    return this.http.post(`${environment.apiUrl}/api/register`, registerData);
  }
  // Connexion et enregistrement des tokens
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        this.setTokens(response.accessToken, response.refreshToken);
        console.log("response.accessToken :\n\n" + response.accessToken + "\n\n\n\n\n\n\n\n response.refreshToken : \n\n" + response.refreshToken)
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
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      // this.logout();
      // On ne fait rien si le refreshToken est absent
      console.warn('Aucun refreshToken trouvé.');
      return new Observable();
    }
  
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/refresh-token`, { refreshToken }).pipe(
      tap((response: AuthResponse) => {
        if (response && response.accessToken) {
          sessionStorage.setItem('accessToken', response.accessToken);
        }
      }),
      catchError((error) => {
        console.error('Erreur lors du rafraîchissement du token', error);
        // Ne pas appeler logout ici pour éviter de supprimer le refreshToken
        return throwError(() => new Error('Erreur lors du rafraîchissement du token'));
      })
    );
  }

  // Vérifie si le token est expiré et le rafraîchit si nécessaire
  // logoutIfTokenExpired(): void {
  //   const token = this.getAccessToken();
  //   if (token) {
  //     const expirationDate = this.getTokenExpirationDate(token);
  //     if (expirationDate && expirationDate < new Date()) {
  //       this.refreshAccessToken().subscribe({
  //         error: () => {
  //           this.logout();
  //         }
  //       });
  //     }
  //   }
  // }

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
