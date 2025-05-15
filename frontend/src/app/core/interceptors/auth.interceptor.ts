import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../../features/auth/services/token.service';
import { AuthService } from '../../features/auth/services/auth.service';


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
        if (
          error.status === 401 && 
          !req.url.includes('/refresh-token') &&
          !req.url.includes('/login')
        ) {
          // Si l'erreur 401 survient, tenter un rafraîchissement du token
          return this.authService.refreshAccessToken().pipe(
            switchMap((newToken: string) => {
              this.tokenService.setAccessToken(newToken);
  
              // Réémettre la requête initiale avec le nouveau token
              return next.handle(
                req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` },
                })
              );
            }),
            catchError(() => {
              // Si le rafraîchissement échoue, déconnexion
              //Erreur liée à une session expirée ET toutes les autres
              console.warn('JWT expired. Logging out...');
              // alert('auth.interceptor: authService.refreshAccessToken (alors que faux login) Votre session a expiré, vous allez être redirigé vers la page de connexion.');
              this.authService.logout();
              this.router.navigate(['/']);
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
