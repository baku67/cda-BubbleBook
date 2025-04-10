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
  dragOffset: number = 0; // décalage pendant le geste
  
  private initialX: number | null = null;
  private currentX: number | null = null;
  private swipeThreshold: number = 50; // seuil en pixels pour déclencher le swipe

  onPointerDown(event: PointerEvent) {
    this.initialX = event.clientX;
  }

  onPointerMove(event: PointerEvent) {
    if (this.initialX !== null) {
      this.dragOffset = event.clientX - this.initialX;
    }
  }

  onPointerUp(event: PointerEvent) {
    if (this.initialX !== null) {
      if (this.dragOffset < -this.swipeThreshold && this.currentSlide < this.slides.length - 1) {
        this.currentSlide++;
      } else if (this.dragOffset > this.swipeThreshold && this.currentSlide > 0) {
        this.currentSlide--;
      }
    }
    // Réinitialiser le geste
    this.dragOffset = 0;
    this.initialX = null;
  }

    // Calcule la translation à appliquer, en fonction de la slide actuelle et de l'offset du geste
    getSlideTransform(): string {
      return `translateX(calc(-${this.currentSlide * 100}% + ${this.dragOffset}px))`;
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
