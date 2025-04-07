import { Component } from '@angular/core';
interface Slide {
  icon: string;
  title: string; 
  description: string;
}

@Component({
  selector: 'app-landing-page-discover',
  templateUrl: './landing-page-discover.component.html',
  styleUrl: './landing-page-discover.component.scss'
})
export class LandingPageDiscoverComponent {
  slides: Slide[] = [
    { icon: 'home', title: 'Accueil', description: 'Bienvenue sur notre site!' },
    { icon: 'info', title: 'À propos', description: 'En savoir plus sur nous.' },
    { icon: 'contact_page', title: 'Contact', description: 'Contactez-nous pour plus d\'informations.' }
  ];
  currentSlide: number = 0;
  
  private initialX: number | null = null;
  private currentX: number | null = null;
  private swipeThreshold: number = 50; // seuil en pixels pour déclencher le swipe

  onPointerDown(event: PointerEvent) {
    this.initialX = event.clientX;
  }

  onPointerMove(event: PointerEvent) {
    if (this.initialX !== null) {
      this.currentX = event.clientX;
    }
  }

  onPointerUp(event: PointerEvent) {
    if (this.initialX !== null && this.currentX !== null) {
      const diffX = this.initialX - this.currentX;
      if (diffX > this.swipeThreshold) {
        console.log('Swipe gauche détecté');
        this.nextSlide();
      } else if (diffX < -this.swipeThreshold) {
        console.log('Swipe droit détecté');
        this.previousSlide();
      }
    }
    // Réinitialiser les positions
    this.initialX = null;
    this.currentX = null;
  }

  nextSlide() {
    console.log('nextSlide');
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    }
  }

  previousSlide() {
    console.log('previousSlide');
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
