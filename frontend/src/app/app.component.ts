import { Component, OnInit } from '@angular/core';
import { AuthService } from './features/auth/services/auth.service';
import { LanguageService } from './shared/services/utils/language.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'BubbleBook';

  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    // S'abonner à l'observable pour suivre l'état de connexion
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

}
