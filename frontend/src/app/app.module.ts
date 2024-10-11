import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    RouterOutlet, 
    RouterModule.forRoot([]),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }