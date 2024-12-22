import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss'
})
export class BackButtonComponent {

  @Input() backRoute?:string;

  constructor(
    private router:Router,
    private location: Location,
  ) {};

  navigateBack() {
    if(this.backRoute) {
      this.router.navigate([`/${this?.backRoute}`]); // Si input passé
    }
    else {
      this.location.back();
    }
    
  }
}
