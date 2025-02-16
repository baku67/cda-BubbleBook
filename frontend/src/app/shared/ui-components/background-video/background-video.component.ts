import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-background-video',
  templateUrl: './background-video.component.html',
  styleUrl: './background-video.component.scss',
  standalone: true,
  imports: [],
})
export class BackgroundVideoComponent {
  
  @Output() videoLoaded = new EventEmitter<boolean>(); // ✅ Émet un event quand la vidéo est prête
  @ViewChild('backgroundVideo', { static: false }) backgroundVideo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    console.log("🎥 [BackgroundVideoComponent] Vérification de la vidéo en cours...");

    if (!this.backgroundVideo || !this.backgroundVideo.nativeElement) {
      console.error("❌ [BackgroundVideoComponent] La vidéo n'a pas été trouvée !");
      return;
    }

    const video = this.backgroundVideo.nativeElement;

    video.onplaying = () => {
      console.log("🎬 [BackgroundVideoComponent] La vidéo a commencé à jouer !");
      this.videoLoaded.emit(true);
    };

    video.oncanplaythrough = () => {
      console.log("✅ [BackgroundVideoComponent] La vidéo est prête !");
    };

    video.onerror = (error) => {
      console.error("❌ [BackgroundVideoComponent] Erreur de chargement de la vidéo :", error);
      this.videoLoaded.emit(true); // Ne pas bloquer l'app si la vidéo échoue
    };

    // Timeout de secours
    setTimeout(() => {
      console.warn("⏳ [BackgroundVideoComponent] Timeout : On continue sans attendre la vidéo.");
      this.videoLoaded.emit(true);
    }, 5000);

    video.play().catch(() => {
      console.log("🔇 Auto-play bloqué, tentative de relance...");
      video.muted = true;
      video.play();
    });
  }
}
