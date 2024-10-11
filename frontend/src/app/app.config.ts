import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';


// ApplicationConfig : C'est un type Angular utilisé pour fournir des configurations spécifiques à l'application. Il remplace le rôle que jouait le NgModule dans la configuration des services globaux, des routes, et d'autres providers.
// provideZoneChangeDetection() : Ce service configure Angular pour la détection des changements (change detection). Ici, il utilise une option eventCoalescing: true, qui permet de regrouper plusieurs événements DOM en un seul cycle de détection de changement, ce qui améliore les performances dans certaines situations.
// provideRouter() : Cela remplace l'importation des routes à travers les modules. Il configure directement le routeur Angular dans l'application en utilisant les routes définies dans app.routes.ts.

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
  ]
};
