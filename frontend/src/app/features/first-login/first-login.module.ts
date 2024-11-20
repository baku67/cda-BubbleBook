import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
// Customs
import { FirstLogin1Component } from './components/first-login-1/first-login-1.component';
import { FirstLogin2Component } from './components/first-login-2/first-login-2.component';
import { routes } from '../../app.routes';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    FirstLogin1Component,
    FirstLogin2Component,
  ],
  imports: [
    CommonModule, 
    FormsModule,
    RouterModule,
    
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatFormFieldModule,

    SharedModule,

    RouterModule.forRoot(routes),
  ]
})
export class FirstLoginModule { }
