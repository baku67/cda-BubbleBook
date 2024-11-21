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

// Standalone:
// import { FooterComponent } from './shared/ui-components/footer/footer.component';

// ngxTranslate:
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Fonction qui crée une instance de TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginPageComponent,
    RegisterPageComponent, 
    UserProfilComponent,
    AlertBannerComponent,
    ConfirmEmailComponent,
  ],
  imports: [
    BrowserModule, 
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    MatButtonModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinner,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    
    FirstLoginModule,
    SharedModule,
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
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }