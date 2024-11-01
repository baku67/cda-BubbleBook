import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/components/landing-page/landing-page.component';

import { routes } from './app.routes';  // Import the routes
import { LoginPageComponent } from './features/auth/components/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/components/register-page/register-page.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
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

// Standalone:
// import { FooterComponent } from './shared/ui-components/footer/footer.component';


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
    // RouterModule.forRoot([]),
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinner,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    
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