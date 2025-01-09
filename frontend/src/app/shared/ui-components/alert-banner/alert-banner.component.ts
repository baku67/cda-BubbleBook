import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-alert-banner',
  templateUrl: './alert-banner.component.html',
  styleUrl: './alert-banner.component.scss'
})
export class AlertBannerComponent {
  @Input() msgAlert!:string;
  @Input() maticon?:string;
  @Input() style!:string;

  constructor() {}

  hostClass: string = '';

  // ngOn

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['style']) {
      this.updateHostClass();
    }
  }

  private updateHostClass(): void {
    this.hostClass = `alert-banner-${this.style}`;
  }
}
