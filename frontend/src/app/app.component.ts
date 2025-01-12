import { Component, OnInit } from '@angular/core';
import { AuthService } from './features/auth/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  title = 'BubbleBook';
  isLoggedIn = false;

  // Conditions d'affichage : Pour spécifier quels routes sans PageHeaderComponent ou/et FooterComponent etc...
  showUxButtons = true;
  showHeader = true;
  showFooter = true;
  showNavBottomMobile = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Routes avec UX boutons (theme et lang)
        const uxBtnRoutes = ['', '/', "/register", "/login", "/first-login/step-one", "/first-login/step-two"]; // LP = ""
        // Routes sans header
        const noHeaderRoutes = ['', '/']; // LP = ""
        // Routes sans footer 
        const noFooterRoutes: string[] = []; 
        // Routes sans navBottomMobile
        const noNavBottomMobileRoutes = [
          '',
          '/',
          '/first-login/step-one', // à voir (plus de paramétrages)
          '/first-login/step-two' // à voir (plus de paramétrages)
        ];
  
        this.showUxButtons = uxBtnRoutes.includes(event.urlAfterRedirects);
        this.showHeader = !noHeaderRoutes.includes(event.urlAfterRedirects);
        this.showFooter = !noFooterRoutes.includes(event.urlAfterRedirects);
        this.showNavBottomMobile = !noNavBottomMobileRoutes.includes(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    // S'abonner à l'observable pour suivre l'état de connexion
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

}
