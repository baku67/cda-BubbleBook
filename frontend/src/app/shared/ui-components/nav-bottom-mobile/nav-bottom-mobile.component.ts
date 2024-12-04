import { Component, Input } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-nav-bottom-mobile',
  standalone: true,
  imports: [MatButton, MatIcon, CommonModule],
  templateUrl: './nav-bottom-mobile.component.html',
  styleUrl: './nav-bottom-mobile.component.scss'
})
export class NavBottomMobileComponent {

  @Input() isLoggedIn!: boolean;

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Rediriger vers la landinPage
  }
}
