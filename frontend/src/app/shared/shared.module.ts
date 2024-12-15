import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './ui-components/footer/footer.component';
import { NavBottomMobileComponent } from './ui-components/nav-bottom-mobile/nav-bottom-mobile.component';
import { PageHeaderComponent } from './ui-components/page-header/page-header.component';
import { AppHeaderComponent } from './ui-components/app-header/app-header.component';
import { MatIcon } from '@angular/material/icon';
import { LanguageSwitchComponent } from './ui-components/language-switch/language-switch.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    AppHeaderComponent,
    FooterComponent,
    NavBottomMobileComponent, 
    LanguageSwitchComponent,
    MatIcon,
    TranslateModule,
  ],
  exports: [
    PageHeaderComponent,
    AppHeaderComponent,
    FooterComponent,
    NavBottomMobileComponent,
    LanguageSwitchComponent,
  ]
})
export class SharedModule { }
