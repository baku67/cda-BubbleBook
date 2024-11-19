import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { NavComponent } from "../nav/nav.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [NavComponent, CommonModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css'
})
export class PageHeaderComponent implements OnInit {

  @Input() title!: string;
  @Input() subtitle?: string | null;
  @Input() paragraph?: string | null;

  isLoggedIn = false; 

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // S'abonner à l'observable pour suivre l'état de connexion
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

}
