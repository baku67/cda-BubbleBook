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
import { BackButtonComponent } from './ui-components/back-button/back-button.component';
import { ModalComponent } from './ui-components/modal/modal.component';
import { AlertBannerComponent } from './ui-components/alert-banner/alert-banner.component';
import { NotFoundPageComponent } from './ui-components/not-found-page/not-found-page.component';
import { BackgroundVideoComponent } from './ui-components/background-video/background-video.component';
import { ChoiceComponent } from './ui-components/choice/choice.component';


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
    BackButtonComponent,
    ModalComponent,
    AlertBannerComponent,
    NotFoundPageComponent,
    BackgroundVideoComponent,
    ChoiceComponent,
  ],
  exports: [
    PageHeaderComponent,
    AppHeaderComponent,
    FooterComponent,
    NavBottomMobileComponent,
    LanguageSwitchComponent,
    BackButtonComponent,
    ModalComponent,
    AlertBannerComponent,
    NotFoundPageComponent,
    BackgroundVideoComponent,
    ChoiceComponent,
  ]
})
export class SharedModule { }
