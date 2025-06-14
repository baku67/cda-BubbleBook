import { Routes } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/components/landing-page/landing-page.component';
import { RegisterPageComponent } from './features/auth/components/register-page/register-page.component';
import { LoginPageComponent } from './features/auth/components/login-page/login-page.component';
import { UserProfilComponent } from './features/profil/components/user-profil/user-profil.component';
import { FirstLoginStep1Component } from './features/first-login-steps/components/first-login-step1/first-login-step1.component';
import { FirstLoginStep2Component } from './features/first-login-steps/components/first-login-step2/first-login-step2.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PreventPublicAccessGuard } from './core/guards/prevent-access-public.guard';
import { ConfirmEmailPageComponent } from './features/profil/components/confirm-email-page/confirm-email-page.component';
import { AccountSettingsComponent } from './features/profil/components/account-settings/account-settings.component';
import { CertificateManagerPageComponent } from './features/certificates/components/certificate-manager-page/certificate-manager-page.component';
import { NotFoundPageComponent } from './shared/ui-components/not-found-page/not-found-page.component';
import { FadeOutGuard } from './core/guards/fade-out.guard';
import { SocialPageComponent } from './features/social/components/social-page/social-page.component';
import { OtherUserProfilComponent } from './features/social/components/other-user-profil/other-user-profil.component';
import { UserProfileResolver } from './core/resolvers/user-profil.resolver';
import { LandingPageHomeComponent } from './features/landing-page/components/landing-page-home/landing-page-home.component';
import { LandingPageDiscoverComponent } from './features/landing-page/components/landing-page-discover/landing-page-discover.component';
import { DivelogListPageComponent } from './features/divelog/components/divelog-list-page/divelog-list-page.component';
import { DivelogDetailPageComponent } from './features/divelog/components/divelog-detail-page/divelog-detail-page.component';
import { DivelogDetailOverviewComponent } from './features/divelog/components/divelog-detail-overview/divelog-detail-overview.component';
import { NotificationsPageComponent } from './features/notification/components/notifications-page/notifications-page.component';
import { LegalComponent } from './features/legal/legal.component';

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
        path: 'notifications',
        component: NotificationsPageComponent,
        canActivate: [AuthGuard], 
        canDeactivate: [FadeOutGuard],
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

    { 
        path: 'certificates', 
        component: CertificateManagerPageComponent, 
        canActivate: [AuthGuard], 
        canDeactivate: [FadeOutGuard] 
    },


    // DIVELOGS:
    { 
        path: 'divelogs', 
        canActivate: [AuthGuard], 
        canDeactivate: [FadeOutGuard],
        resolve: { currentUser: UserProfileResolver }, // pour savoir par exemple si isVerified
        children: [
            {
                path: '',
                canDeactivate: [FadeOutGuard],
                component: DivelogListPageComponent, // liste des carnets
            },
            {
                path: ':id',
                canDeactivate: [FadeOutGuard],
                component: DivelogDetailPageComponent,
                children: [
                    {
                        path: '',
                        canDeactivate: [FadeOutGuard],
                        component: DivelogDetailOverviewComponent, // détail du carnet
                    }
                ]
            }
          ]
    },


    // SOCIAL:
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
    },


    // Confirmation mail:
    { path: 'confirm-email', component: ConfirmEmailPageComponent, canDeactivate: [FadeOutGuard] },

    { path: 'not-found', component: NotFoundPageComponent, canDeactivate: [FadeOutGuard] },  
    
    // Légal, politique de confidentialité, etc.
    {
        path: 'legal',
        component: LegalComponent,
        canDeactivate: [FadeOutGuard],
    },
    
    // EN DERNIER:
    { path: '**', component: NotFoundPageComponent, canDeactivate: [FadeOutGuard] },  // Wildcard, redirect all unknown paths to home




];


