import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
// Customs
import { FirstLoginStep1Component } from './components/first-login-step1/first-login-step1.component';
import { FirstLoginStep2Component } from './components/first-login-step2/first-login-step2.component';
import { routes } from '../../app.routes';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../auth/services/interceptors/auth.interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// Extension Material 
import { MatSelectCountryModule } from "@angular-material-extensions/select-country";
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    FirstLoginStep1Component,
    FirstLoginStep2Component,
  ],
  imports: [
    SharedModule,
    
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,

    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatFormFieldModule,

    SharedModule,

    RouterModule.forRoot(routes),
    MatSelectCountryModule.forRoot('fr'),
  ],
  providers: [
    { 
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, 
      useValue: { appearance: 'outline' }  
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true  
    }
  ],
})
export class FirstLoginStepsModule { }
