import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './ui-components/footer/footer.component';
import { NavComponent } from './ui-components/nav/nav.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    FooterComponent,
    NavComponent,
  ],
  exports: [
    FooterComponent,
    NavComponent,
  ]
})
export class SharedModule { }
