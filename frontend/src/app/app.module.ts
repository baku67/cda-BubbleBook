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
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    RegisterComponent, 
  ],
  imports: [
    BrowserModule, 
    // RouterModule.forRoot([]),
    RouterModule.forRoot(routes),
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule { }