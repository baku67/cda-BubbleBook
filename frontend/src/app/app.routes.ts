import { Routes } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/components/landing-page/landing-page.component';
import { RegisterPageComponent } from './features/auth/components/register-page/register-page.component';
import { LoginPageComponent } from './features/auth/components/login-page/login-page.component';
import { UserProfilComponent } from './features/profil/components/user-profil/user-profil.component';
import { FirstLoginStep1Component } from './features/first-login-steps/components/first-login-step1/first-login-step1.component';
import { FirstLoginStep2Component } from './features/first-login-steps/components/first-login-step2/first-login-step2.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PreventPublicAccessGuard } from './core/guards/prevent-access-public.guard';
import { ConfirmEmailComponent } from './features/profil/components/confirm-email/confirm-email.component';
import { AccountSettingsComponent } from './features/profil/components/account-settings/account-settings.component';
import { CertificateManagerPageComponent } from './features/certificates/components/certificate-manager-page/certificate-manager-page.component';
import { NotFoundPageComponent } from './shared/ui-components/not-found-page/not-found-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent, canActivate: [PreventPublicAccessGuard] },  // Home page

    { path: 'register', component: RegisterPageComponent, canActivate: [PreventPublicAccessGuard] },  // Register
    { path: 'login', component: LoginPageComponent, canActivate: [PreventPublicAccessGuard] },  // Login

    // Pour empêcher un utilisateur déconnecté d'accéder à certaines pages protégées: GUARD
    { path: 'user-profil', component: UserProfilComponent, canActivate: [AuthGuard] },
    { path: 'account-settings', component: AccountSettingsComponent, canActivate: [AuthGuard] },

    { path: 'first-login/step-one', component: FirstLoginStep1Component, canActivate: [AuthGuard] },
    { path: 'first-login/step-two', component: FirstLoginStep2Component, canActivate: [AuthGuard] },

    { path: 'certificates', component: CertificateManagerPageComponent, canActivate: [AuthGuard] },

    // Confirmation mail:
    { path: 'confirm-email', component: ConfirmEmailComponent },

    // EN DERNIER:
    { path: '**', component: NotFoundPageComponent },  // Wildcard, redirect all unknown paths to home
];


