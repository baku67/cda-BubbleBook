import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service'; // Assure-toi d'avoir un service Auth qui gère le stockage du JWT
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Récupérer le token JWT depuis AuthService
    const token = this.authService.getAccessToken();

    // Cloner la requête et ajouter l'en-tête Authorization si le token existe
    let clonedRequest = req;
    if (token) {
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Si accessToken expiré = logout() (pour l'instant)
    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.warn('JWT expired. Logging out...');
          alert('Votre session a expiré, vous allez être redirigé vers la page de connexion.');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        // Renvoie l'erreur à l'appelant de la requête HTTP
        return throwError(() => error);
      })
    );
  }
}
