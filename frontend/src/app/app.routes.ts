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
import { FadeOutGuard } from './core/guards/fade-out.guard';
import { Test1Component } from './shared/ui-components/test/test-1/test-1.component';
import { Test2Component } from './shared/ui-components/test/test-2/test-2.component';
import { SocialPageComponent } from './features/social/components/social-page/social-page.component';
import { OtherUserProfilComponent } from './features/social/components/other-user-profil/other-user-profil.component';
import { OtherUserProfileResolver } from './core/resolvers/other-user-profil.resolver';
import { UserProfileResolver } from './core/resolvers/user-profil.resolver';
import { LandingPageHomeComponent } from './features/landing-page/components/landing-page-home/landing-page-home.component';
import { LandingPageDiscoverComponent } from './features/landing-page/components/landing-page-discover/landing-page-discover.component';

export const routes: Routes = [
    // LandingPage + Login/Register Pages
    { 
        path: '',
        component: LandingPageComponent, 
        children: [
            {
                path: '', 
                component: LandingPageHomeComponent, 
                canActivate: [PreventPublicAccessGuard], 
            },
            {
                path: 'discover', 
                component: LandingPageDiscoverComponent, 
                canActivate: [PreventPublicAccessGuard], 
            },
            { 
                path: 'register', 
                component: RegisterPageComponent, 
                canActivate: [PreventPublicAccessGuard], 
            },  
            { 
                path: 'login', 
                component: LoginPageComponent, 
                canActivate: [PreventPublicAccessGuard], 
            },  
        ],
        canActivate: [PreventPublicAccessGuard], 
        canDeactivate: [FadeOutGuard] 
    }, 

    { 
        path: 'user-profil', 
        component: UserProfilComponent, 
        canActivate: [AuthGuard], 
        canDeactivate: [FadeOutGuard],
        // resolve: { currentUser: UserProfileResolver } // Pas de resolver pour avoir toujours l'user à jour
    },

    { 
        path: 'account-settings', 
        component: AccountSettingsComponent, 
        canActivate: [AuthGuard], 
        canDeactivate: [FadeOutGuard],
        // resolve: { currentUser: UserProfileResolver } // Pas de resolver pour avoir toujours l'user à jour dans tous les composants enfants sans besoin d'Output
    },

    { path: 'first-login/step-one', component: FirstLoginStep1Component, canActivate: [AuthGuard], canDeactivate: [FadeOutGuard] },
    { path: 'first-login/step-two', component: FirstLoginStep2Component, canActivate: [AuthGuard], canDeactivate: [FadeOutGuard] },

    { path: 'certificates', component: CertificateManagerPageComponent, canActivate: [AuthGuard], canDeactivate: [FadeOutGuard] },

    { 
        path: 'social', 
        component: SocialPageComponent, 
        canActivate: [AuthGuard], 
        canDeactivate: [FadeOutGuard],
        resolve: { currentUser: UserProfileResolver } // pour savoir par exemple si isVerified
    },
    { 
        path: 'social/user-profil/:id', 
        component: OtherUserProfilComponent, 
        canActivate: [AuthGuard], 
        canDeactivate: [FadeOutGuard],
        resolve: { otherUser: OtherUserProfileResolver }
    },


    // Confirmation mail:
    { path: 'confirm-email', component: ConfirmEmailComponent, canDeactivate: [FadeOutGuard] },

    { path: 'test1', component: Test1Component, canDeactivate: [FadeOutGuard] },
    { path: 'test2', component: Test2Component, canDeactivate: [FadeOutGuard] },

    { path: 'not-found', component: NotFoundPageComponent, canDeactivate: [FadeOutGuard] },  
    // EN DERNIER:
    { path: '**', component: NotFoundPageComponent, canDeactivate: [FadeOutGuard] },  // Wildcard, redirect all unknown paths to home
];


