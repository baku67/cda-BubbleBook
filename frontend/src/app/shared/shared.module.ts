import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './ui-components/footer/footer.component';
import { NavComponent } from './ui-components/nav/nav.component';
import { PageHeaderComponent } from './ui-components/page-header/page-header.component';
import { AppHeaderComponent } from './ui-components/app-header/app-header.component';
import { MatIcon } from '@angular/material/icon';
import { LanguageSwitchComponent } from './ui-components/language-switch/language-switch.component';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    PageHeaderComponent,
    AppHeaderComponent,
    FooterComponent,
    NavComponent, 
    LanguageSwitchComponent,
    MatIcon
  ],
  exports: [
    PageHeaderComponent,
    AppHeaderComponent,
    FooterComponent,
    NavComponent,
    LanguageSwitchComponent,
  ]
})
export class SharedModule { }
