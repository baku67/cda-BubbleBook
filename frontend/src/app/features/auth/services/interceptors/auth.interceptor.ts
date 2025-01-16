import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../token.service';
import { AuthService } from '../auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Récupérer le token JWT depuis AuthService
    const token = this.tokenService.getAccessToken();

    // Cloner la requête et ajouter l'en-tête Authorization si le token existe
    let clonedRequest = req;
    if (token) {
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (req.url.includes('/login')) {
            // Erreur Identifiants incirrectes
            console.warn('Invalid credentials authIntercepor.');
          } else {
            // Erreur liée à une session expirée ET toutes les autres
            console.warn('JWT expired. Logging out...');
            alert('Votre session a expiré, vous allez être redirigé vers la page de connexion.');
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
        return throwError(() => error);
      })
    );
  }
}
