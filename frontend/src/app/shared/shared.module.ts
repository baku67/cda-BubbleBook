import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './ui-components/footer/footer.component';
import { NavComponent } from './ui-components/nav/nav.component';
import { HeaderComponent } from './ui-components/header/header.component';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    NavComponent, 
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    NavComponent,
  ]
})
export class SharedModule { }
