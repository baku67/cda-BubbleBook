import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-banner',
  templateUrl: './alert-banner.component.html',
  styleUrl: './alert-banner.component.scss'
})
export class AlertBannerComponent {
  @Input() msgAlert:string;

  constructor() {
    this.msgAlert = "";
  }
}
