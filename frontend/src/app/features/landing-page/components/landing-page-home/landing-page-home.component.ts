import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page-home',
  templateUrl: './landing-page-home.component.html',
  styleUrl: './landing-page-home.component.scss'
})
export class LandingPageHomeComponent {

  constructor(
    private router: Router,
  ) { }

  toggleDiscovery(): void {
  // <!-- Idée: quand on clique "dicover", ça slide vers la gauche pour afficher les pages de présentation (1 page = 1 fonctionalité) et ducoup le bouton discover devient un bouton de navigation entres les étapes/slides de pésentaztion + bouton-icon-home pour revenir revenir -->
  // <!-- Un carrousel quoi -->
    this.router.navigate(['/discover']);
  }
}