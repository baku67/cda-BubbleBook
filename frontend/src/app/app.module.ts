import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/components/landing-page/landing-page.component';
import { LoginPageComponent } from './features/auth/components/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/components/register-page/register-page.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserProfilComponent } from './features/profil/components/user-profil/user-profil.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { SharedModule } from './shared/shared.module';
import { FirstLoginStepsModule } from './features/first-login-steps/first-login-steps.module';
import { ConfirmEmailPageComponent } from './features/profil/components/confirm-email-page/confirm-email-page.component';
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
import { CertificateManagerPageComponent } from './features/certificates/components/certificate-manager-page/certificate-manager-page.component';
import { CdkDrag, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { CertificateFormComponent } from './features/certificates/components/certificate-form/certificate-form.component';
import { ModalComponent } from './shared/ui-components/modal/modal.component';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BannerSelectionComponent } from './features/profil/components/banner-selection/banner-selection.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';

import { routes } from './app.routes';  // Import the routes
import { AuthService } from './features/auth/services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { SocialPageComponent } from './features/social/components/social-page/social-page.component';
import { UserSearchComponent } from './features/social/components/user-search/user-search.component';
import { OtherUserProfilComponent } from './features/social/components/other-user-profil/other-user-profil.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ThemePrimaryColorService } from './shared/services/utils/theme-primary-color.service';
import { LottieComponent, provideLottieOptions } from 'ngx-lottie';
import { LandingPageHomeComponent } from './features/landing-page/components/landing-page-home/landing-page-home.component';
import { AccountSettingsComponent } from './features/profil/components/account-settings/account-settings.component';
import { AccountSettingsInterfaceComponent } from "./features/profil/components/account-settings-interface/account-settings-interface.component";
import { AccountSettingsPrivacyComponent } from './features/profil/components/account-settings-privacy/account-settings-privacy.component';
import { AccountSettingsProfilComponent } from './features/profil/components/account-settings-profil/account-settings-profil.component';
import { LandingPageDiscoverComponent } from './features/landing-page/components/landing-page-discover/landing-page-discover.component';
import { DivelogListPageComponent } from './features/divelog/components/divelog-list-page/divelog-list-page.component';
import { DivelogFormComponent } from './features/divelog/components/divelog-form/divelog-form.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { DivelogDetailPageComponent } from './features/divelog/components/divelog-detail-page/divelog-detail-page.component';
import { DivelogDetailOverviewComponent } from './features/divelog/components/divelog-detail-overview/divelog-detail-overview.component';
import { DivelogConfirmationDeleteComponent } from './features/divelog/components/divelog-confirmation-delete/divelog-confirmation-delete.component';
import { ChangeEmailAddressComponent } from './features/profil/components/change-email-address/change-email-address.component';
import { ChangePasswordComponent } from './features/profil/components/change-password/change-password.component';
import { ConfirmDeleteAccountComponent } from './features/profil/components/confirm-delete-account/confirm-delete-account.component';

export function initializeAuthFactory(authService: AuthService) {
  return () => authService.initializeAuthSync();
}

export function initializeThemeFactory(themeService: ThemePrimaryColorService) {
  return () => themeService.applyStoredColor();
}

// Fonction qui crée une instance de TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LandingPageHomeComponent,
    LandingPageDiscoverComponent,
    LoginPageComponent,
    RegisterPageComponent, 
  
    UserProfilComponent,
    UserCardComponent,
    ConfirmEmailPageComponent,
    AccountSettingsComponent,
    AccountSettingsProfilComponent,
    ChangeEmailAddressComponent,
    ChangePasswordComponent,
    ConfirmDeleteAccountComponent,
    AccountSettingsInterfaceComponent,
    AccountSettingsPrivacyComponent,
    CertificateManagerPageComponent,
    CertificateFormComponent,

    BannerSelectionComponent,

    SocialPageComponent,
    UserSearchComponent,
    OtherUserProfilComponent,
    DivelogListPageComponent,
    DivelogFormComponent,
    DivelogDetailPageComponent,
    DivelogDetailOverviewComponent,
    DivelogConfirmationDeleteComponent,
  ],
  imports: [
    MatCardModule,
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
    MatProgressSpinnerModule,
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
    FirstLoginStepsModule,
    SharedModule,
    ThemeSwitchComponent,
    NavBottomMobileComponent,
    // Pour le drag-drop/move list (ccertifs)
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    ModalComponent,
    MatSelectModule,
    MatMenuModule,
    NgxSkeletonLoaderModule,
    MatExpansionModule,
    MatDividerModule,
    MatTabsModule,
    FontAwesomeModule,
    LottieComponent,
    MatButtonToggleModule
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
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuthFactory,
      deps: [AuthService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeThemeFactory,
      deps: [ThemePrimaryColorService],
      multi: true,
    },
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
    MatDatepickerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }