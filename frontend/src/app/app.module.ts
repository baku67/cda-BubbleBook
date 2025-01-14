import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/components/landing-page/landing-page.component';

import { routes } from './app.routes';  // Import the routes
import { LoginPageComponent } from './features/auth/components/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/components/register-page/register-page.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UserProfilComponent } from './features/profil/components/user-profil/user-profil.component';
import { AlertBannerComponent } from './shared/ui-components/alert-banner/alert-banner.component';
import { AuthInterceptor } from './features/auth/services/interceptors/auth.interceptor';
import { SharedModule } from './shared/shared.module';
import { FirstLoginModule } from './features/first-login/first-login.module';
import { ConfirmEmailComponent } from './features/profil/components/confirm-email/confirm-email.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import {MatDatepickerModule} from '@angular/material/datepicker';

// Standalone:
// import { FooterComponent } from './shared/ui-components/footer/footer.component';

// ngxTranslate:
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ThemeSwitchComponent } from "./shared/ui-components/theme-switch/theme-switch.component";
import { NavBottomMobileComponent } from './shared/ui-components/nav-bottom-mobile/nav-bottom-mobile.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserCardComponent } from './features/profil/components/user-card/user-card.component';
import { MatSelectCountryModule } from "@angular-material-extensions/select-country";
import { AccountSettingsComponent } from './features/account-settings/account-settings.component';
import { CertificateManagerPageComponent } from './features/certificates/components/certificate-manager-page/certificate-manager-page.component';
import { CdkDrag, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { CertificateFormComponent } from './features/certificates/components/certificate-form/certificate-form.component';
import { ModalComponent } from './shared/ui-components/modal/modal.component';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BannerSelectionComponent } from './features/profil/components/banner-selection/banner-selection.component';


// Fonction qui crée une instance de TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

// Attention: budget initial bundle augmenté manuellement dans angular.json en attendant de mieux gérer les modules 
@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginPageComponent,
    RegisterPageComponent, 
    UserProfilComponent,
    UserCardComponent,
    ConfirmEmailComponent,
    AccountSettingsComponent,
    CertificateManagerPageComponent,
    CertificateFormComponent,
    BannerSelectionComponent,
  ],
  imports: [
    MatSelectCountryModule.forRoot('fr'),
    BrowserModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', // Active la restauration de la position de scroll
      anchorScrolling: 'enabled', // Active le scrolling vers les ancres si nécessaires
    }),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormField,
    MatOptionModule,
    MatLabel,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatProgressSpinner,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatCheckboxModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    FirstLoginModule,
    SharedModule,
    ThemeSwitchComponent,
    NavBottomMobileComponent,

    // Pour le drag-drop/move list (ccertifs)
    CdkDropList, 
    CdkDrag, 
    CdkDragPlaceholder,
    ModalComponent,
    MatSelectModule,
],
  providers: [
    { 
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, 
      useValue: { appearance: 'outline' }  // Ton option actuelle pour Angular Material
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true  // Ajout de l'Interceptor
    },
    MatDatepickerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }