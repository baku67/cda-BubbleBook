import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './features/auth/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { LandingPageService } from './features/landing-page/service/landing-page.service';
import { ThemeType } from './shared/models/ThemeType.model';
import { Observable } from 'rxjs';
import { ThemeService } from './shared/services/utils/theme.service';
import { faFish, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
import { CustomizationService } from './shared/services/utils/customization.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  public title = 'BubbleBook';
  public isLoggedIn = false;

  public isInitializingAuth = true;
  public isInitializingVideoBg = true;

  // Inputs du FlashMessageComponent:
  public flashMessage: string | null = null;
  public flashType: 'success' | 'error' | 'info' = 'info';
  public flashMatIcon: 'check_circle' | 'warning' | 'info' | null = null;

  // Conditions d'affichage : Pour spécifier quels routes sans PageHeaderComponent ou/et FooterComponent etc...
  public showUxButtons = true;
  public showHeader = true;
  public showFooter = true;
  public showNavBottomMobile = false;

  public currentTheme$: Observable<ThemeType>;
  public displayFish$!: Observable<boolean>;
  public isBgVideo$!: Observable<boolean>;

  public fishIcon = faFish;
  public videoIcon = faVideo;
  public videoIconSlash = faVideoSlash;

  // *** Lottie SVG container (pour modifier la couleur sans recompilation JSON depuis le site):
  @ViewChild('lottieWrapper', { static: false }) lottieWrapper!: ElementRef;

  // *** UxMenuBtn:
  @ViewChild('UxMenuWrapper', { static: false }) UxMenuWrapper!: ElementRef;
  public isMenuOpen = false;

  // Interception (mais prevent pas le click! trop bien?) du clic global sur le document (pour désafficher le menu si on clique en dehors):
  @HostListener('document:click', ['$event.target'])
  public onClickOutside(targetElement: HTMLElement) {
    // 1) Vérifier si le menu est ouvert
    if (this.isMenuOpen) {
      // 2) Vérifier si le clic est hors du wrapper btn+menu
      const clickedInsideMenu = this.UxMenuWrapper.nativeElement.contains(targetElement);

      if (!clickedInsideMenu) {
        // => On ferme le menu
        this.isMenuOpen = false;
      }
    }
  }

  constructor(
    private landingPageService: LandingPageService,
    private authService: AuthService,
    private themeService: ThemeService,
    private customizationService: CustomizationService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Routes AVEC UX boutons (theme et lang)
        const uxBtnRoutes = ['', '/', '/discover', '/login', '/register', 'discover', '/first-login/step-one', '/first-login/step-two']; // LP = ""
        // Routes SANS header
        const noHeaderRoutes = ['', '/', '/discover', '/login', '/register'];
        // Routes SANS footer 
        const noFooterRoutes: string[] = ['', '/']; 
        // Routes SANS navBottomMobile
        const noNavBottomMobileRoutes = [
          '',
          '/',
          '/register',
          '/login',
          '/first-login/step-one', // à voir (plus de paramétrages)
          '/first-login/step-two' // à voir (plus de paramétrages)
        ];
  
        this.showUxButtons = uxBtnRoutes.includes(event.urlAfterRedirects);
        this.showHeader = !noHeaderRoutes.includes(event.urlAfterRedirects);
        this.showFooter = !noFooterRoutes.includes(event.urlAfterRedirects);
        this.showNavBottomMobile = !noNavBottomMobileRoutes.includes(event.urlAfterRedirects);
      }
    });
    this.currentTheme$ = this.themeService.currentTheme$;
    this.displayFish$ = this.customizationService.displayFishState$;
    this.isBgVideo$ = this.customizationService.isBgVideoState$;
  }

  ngOnInit() {
    // Suivre l'état d'initialisation dans le authService
    this.authService.isInitializingAuthObservable.subscribe(isInitializingAuth => {
      this.isInitializingAuth = isInitializingAuth;
      this.toggleBodyScroll(); // corrige le scroll loader-global (pendant friction positive ?) 
    });

    // Simule la fin de l'initialisation de la vidéo (à remplacer par ton service plus tard)
    this.isInitializingVideoBg = false; // MOCK TEMP "OUI" -> TODO: service
    this.toggleBodyScroll(); // corrige le scroll loader-global (pendant friction positive ?) 

    // S'abonner à l'état de connexion
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    // Initialiser l'authentification (délais gérés plus précisément dans le authService)
    this.authService.initializeAuth().pipe(
    ).subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        // console.log('InitialzeAuth(): echec');
        // this.router.navigate(['/login']); // plus besoin grace aux guards ?
      } else {
        // console.log('InitialzeAuth(): reussi, chargement des données utilisateur...');
        // Chargez les données nécessaires pour l'utilisateur/confirm-mail (TODO juste reload la route actuelle)
        const currentUrl = this.router.url;
        if (!currentUrl.startsWith('/confirm-email')) { // Empeche le confirmEmail 4200/confirm-email parce que c'est un nouvel onglet avec potentiellement un refresh-token présent et ducoup : InitializeAuth->navigate(user-profil)
          // this.router.navigate(['/user-profil']); // testé ok?
        }
      }
    });
  }

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Animation Loader global Lottie:
  options: AnimationOptions = {
    path: '/assets/Lottie-animations/loader-water.json',
    loop: true,
    autoplay: true,
  };
  animationCreated(anim: AnimationItem) {
    setTimeout(() => {
      const svgEl: SVGElement | null =
        this.lottieWrapper.nativeElement.querySelector('svg');
      if (svgEl) {
        svgEl.querySelectorAll('[fill]').forEach(el =>
          // // COULEUR SYNC .SCSS
          (el as SVGElement).setAttribute('fill', '#00ffc3') // /!\ synchro avec app.component.scss:.loading-screen-title
        );
      }
    }, 0);
  }
  private toggleBodyScroll(): void {
    const shouldDisableScroll = this.isInitializingAuth || this.isInitializingVideoBg;
    document.body.style.overflow = shouldDisableScroll ? 'hidden' : '';
  }
  onVideoLoaded() {
    // console.log("🚀 [AppComponent] Vidéo de fond chargée !");
    this.landingPageService.setVideoLoaded(true);
  }

  toggleFishDisplay(): void {
    this.customizationService.toggleDisplayFish();
  }
  
  toggleBgVideo(): void {
    this.customizationService.toggleBgVideo();
  }
}
