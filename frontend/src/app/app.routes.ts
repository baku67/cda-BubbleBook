import { Routes } from '@angular/router';
import { LandingPageComponent } from './routes/home/landing-page/landing-page.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { LoginComponent } from './routes/auth/login/login.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },  // Home page
    { path: 'register', component: RegisterComponent },  // Register
    { path: 'login', component: LoginComponent },  // Login
    { path: '**', redirectTo: '' },  // Wildcard, redirect all unknown paths to home
];

