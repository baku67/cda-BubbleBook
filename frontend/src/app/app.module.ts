import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LandingPageComponent } from './routes/home/landing-page/landing-page.component';

import { routes } from './app.routes';  // Import the routes
import { LoginComponent } from './routes/auth/login/login.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FirstLoginComponent } from './routes/auth/first-login/first-login/first-login.component';
import { UserProfilComponent } from './routes/profil/user-profil/user-profil.component';
import { AlertBannerComponent } from './shared/ui-components/alert-banner/alert-banner.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    RegisterComponent, 
    FirstLoginComponent,
    UserProfilComponent,
    AlertBannerComponent,
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