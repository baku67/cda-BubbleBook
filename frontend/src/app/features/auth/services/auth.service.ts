import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { TokenService } from './token.service';



interface DecodedToken {
  exp?: number;  // Le champ exp représente la date d'expiration en secondes depuis Epoch
}

interface AuthResponse {
  accessToken: string;
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false); // Init false par défaut
  // Observable pour savoir si l'utilisateur est connecté
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router, private tokenService: TokenService) {
    // Initialisation après que TokenService soit injecté
    this.loggedIn.next(this.hasToken());
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


  setTokens(accessToken: string): void {
    this.tokenService.setTokens(accessToken);
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
        this.setTokens(response.accessToken);
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

  // Fonction pour renvoyer l'email de confirmation
  resendConfirmationEmail(email: string): Observable<unknown> {
    const url = `${environment.apiUrl}/api/resend-confirmation`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = JSON.stringify({ email: email });

    return this.http.post(url, body, { headers: headers });
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
