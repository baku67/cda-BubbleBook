import { Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { ThemeService,  } from '../../services/utils/theme.service';
import { ThemeType } from '../../models/ThemeType.model';
import { CommonModule } from '@angular/common';
import { CustomizationService } from '../../services/utils/customization.service';
import { TabTrackerService } from '../../services/utils/tab-tracker.service';

@Component({
  selector: 'app-background-video',
  templateUrl: './background-video.component.html',
  styleUrl: './background-video.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class BackgroundVideoComponent {
  
  @Output() videoLoaded = new EventEmitter<boolean>(); // ✅ Émet un event quand la vidéo est prête
  @ViewChild('backgroundVideo', { static: false }) backgroundVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('backgroundImg', { static: false }) backgroundImg!: ElementRef<HTMLImageElement>;

  activeTabIndex$: Observable<number |null>;
  currentTheme$: Observable<ThemeType>;

  // dark-theme:
  displayFish$!: Observable<boolean>;
  isFishAnimatingOut = false;
  bgObjectPosition = '0%'; // .background-img object-position pour effet slide quand nav
  bgRotate = '10deg';
  // light-theme:
  isBgVideo$!: Observable<boolean>;
  vm$!: Observable<{ currentTheme: ThemeType, isBgVideo: boolean }>;

  showSwordfish = false;  
  private swordfishInterval!: ReturnType<typeof setInterval>;

  constructor(
    private tabTrackerService: TabTrackerService,
    private themeService: ThemeService,
    private customizationService: CustomizationService,
    private renderer: Renderer2,
  ) {
    this.activeTabIndex$ = this.tabTrackerService.activeTabIndex$;
    this.currentTheme$ = this.themeService.currentTheme$;
    this.displayFish$ = this.customizationService.displayFishState$;
    this.isBgVideo$ = this.customizationService.isBgVideoState$;
  }

  ngOnInit() {
    // Calcul des cas de conditions combinés light/dark et toggleFish/toggleVideo etc...
    this.vm$ = combineLatest([
      this.themeService.currentTheme$,
      this.customizationService.isBgVideoState$
    ]).pipe(
      map(([currentTheme, isBgVideo]) => ({ currentTheme, isBgVideo }))
    );

    // Swordfishes: Initialisation du cycle immédiatement
    this.showSwordfishCycle(); 
    this.swordfishInterval = setInterval(() => {
      this.showSwordfishCycle();
    }, 9000); 

    // Slide Background:
    this.activeTabIndex$.subscribe(index => {
      console.log('🟢 [BackgroundVideoComponent] Onglet actif mis à jour:', index);
      this.updateObjectPosition(index);
    });
  }

  // A VOIR (avis mitigé)
  private updateObjectPosition(index: number | null) {
    // C'est chiant parce ces valeurs correspondent au bg dark-theme de base que j'avais mis avant qu'on pouvait choisir l'image (dépend des dimensions): "assets/images/backgrounds/kelp.jpg"
    const positions = ['30%', '40%', '50%', '60%', '70%']; 
    const rotates = ['2deg', '1deg', '0deg', '-1deg', '-2deg']; 
    this.bgObjectPosition = positions[index ?? 0]; // Si null, mettre 0% (gauche)
    this.bgRotate = rotates[index ?? 0]; // Si null, mettre 10deg (gauche)

    if (this.backgroundImg) {
      this.renderer.setStyle(this.backgroundImg.nativeElement, 'object-position', this.bgObjectPosition);
      this.renderer.setStyle(this.backgroundImg.nativeElement, 'transform', `rotate(${this.bgRotate})`);
    }
  }

  ngAfterViewInit() {
    // console.log("🎥 [BackgroundVideoComponent] Vérification de la vidéo en cours...");

    if (!this.backgroundVideo || !this.backgroundVideo.nativeElement) {
      // console.error("❌ [BackgroundVideoComponent] La vidéo n'a pas été trouvée !");
      return;
    }

    const video = this.backgroundVideo.nativeElement;

    video.onplaying = () => {
      // console.log("🎬 [BackgroundVideoComponent] La vidéo a commencé à jouer !");
      this.videoLoaded.emit(true);
    };

    video.oncanplaythrough = () => {
      // console.log("✅ [BackgroundVideoComponent] La vidéo est prête !");
    };

    video.onerror = (error) => {
      // console.error("❌ [BackgroundVideoComponent] Erreur de chargement de la vidéo :", error);
      this.videoLoaded.emit(true); // Ne pas bloquer l'app si la vidéo échoue
    };

    // Timeout de secours
    setTimeout(() => {
      // console.warn("⏳ [BackgroundVideoComponent] Timeout : On continue sans attendre la vidéo.");
      this.videoLoaded.emit(true);
    }, 5000);

    video.play().catch(() => {
      // console.log("🔇 Auto-play bloqué, tentative de relance...");
      video.muted = true;
      video.play();
    });
  }

  private showSwordfishCycle(): void {
    this.showSwordfish = false; // Réinitialise pour redémarrer les animations CSS
    setTimeout(() => {
      this.showSwordfish = true; // Affiche les 3 swordfish ensemble
    }, 50); // léger délai pour réinitialiser l'animation CSS
  }

  ngOnDestroy(): void {
    clearInterval(this.swordfishInterval);
  }
}
