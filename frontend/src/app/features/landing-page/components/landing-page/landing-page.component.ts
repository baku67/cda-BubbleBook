import { Component, ElementRef, ViewChild } from '@angular/core';
import { AnimationService } from '../../../../shared/services/utils/animation.service';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  isAnimatingFadeOut = false;

  @ViewChild('backgroundVideo', { static: false }) backgroundVideo!: ElementRef<HTMLVideoElement>;

  constructor(
    private animationService: AnimationService
  ) {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }

  ngAfterViewInit() {
    this.tryPlayVideo();
  }

  private tryPlayVideo() {
    if (this.backgroundVideo && this.backgroundVideo.nativeElement) {
      const video = this.backgroundVideo.nativeElement;
      
      video.play().catch((error) => {
        console.log("Auto-play bloqué, tentative de relance...", error);
        video.muted = true; // Assurer que la vidéo est muette pour éviter les blocages
        video.play();
      });
    }
  }
  
}
