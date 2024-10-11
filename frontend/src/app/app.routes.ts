import { Routes } from '@angular/router';
import { LandingPageComponent } from './routes/home/landing-page/landing-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },  // Route pour la page d'accueil
    { path: '**', redirectTo: '' }  // Redirection pour les routes non trouvées
];
