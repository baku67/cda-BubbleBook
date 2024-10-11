import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LandingPageComponent } from './routes/home/landing-page/landing-page.component';

import { routes } from './app.routes';  // Import the routes
import { LoginComponent } from './routes/auth/login/login.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule, 
    RouterOutlet, 
    // RouterModule.forRoot([]),
    RouterModule.forRoot(routes),
  ],
  bootstrap: [AppComponent],
  providers: [
    provideAnimationsAsync()
  ]
})
export class AppModule { }