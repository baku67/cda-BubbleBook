import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './ui-components/footer/footer.component';
import { NavComponent } from './ui-components/nav/nav.component';
import { PageHeaderComponent } from './ui-components/page-header/page-header.component';
import { AppHeaderComponent } from './ui-components/app-header/app-header.component';
import { MatIcon } from '@angular/material/icon';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    PageHeaderComponent,
    AppHeaderComponent,
    FooterComponent,
    NavComponent, 
    MatIcon
  ],
  exports: [
    PageHeaderComponent,
    AppHeaderComponent,
    FooterComponent,
    NavComponent,
  ]
})
export class SharedModule { }
