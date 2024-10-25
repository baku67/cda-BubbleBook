import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service'; // Assure-toi d'avoir un service Auth qui gère le stockage du JWT

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Récupérer le token JWT depuis AuthService
    const token = this.authService.getToken();

    // Si le token existe, cloner la requête et ajouter l'en-tête Authorization
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    } 

    // Si pas de token, passer la requête telle quelle
    return next.handle(req);
  }
}
