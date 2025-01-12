import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alert-banner',
  templateUrl: './alert-banner.component.html',
  styleUrl: './alert-banner.component.scss',
  imports: [MatIconModule, CommonModule],
  standalone: true,
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
