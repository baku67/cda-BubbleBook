import { Injectable, ComponentRef, ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { ModalComponent } from '../../ui-components/modal/modal.component';
import { Subject, Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalRef: ComponentRef<any> | null = null;
  private _scrollY = 0;
  private closeSubject = new Subject<any>();
  close$ = this.closeSubject.asObservable();
  private subscription: Subscription | null = null; // Ajout pour gérer les abonnements

  private modalIcon?: string; 

  // Avoid nav back quand l'User clique sur "précédent" navigateur (close modal à la place)
  private popStateListener: ((event: PopStateEvent) => void) | null = null;
  private closingByPopState = false;

  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  open(component: any, data?: any, onClose?: (data?: any) => void): void {
    console.log("Data reçu en paramètre de open() modal.service: " + JSON.stringify(data, null, 2)); // OK

    this._disableBackgroundScroll();

    // Si un modal existe déjà, on le ferme
    if (this.modalRef) {
      this.close();
    }

    // Crée une usine pour le composant ModalComponent
    const modalFactory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);
    this.modalRef = modalFactory.create(this.injector);

    // Attache le composant au cycle de détection
    this.appRef.attachView(this.modalRef.hostView);

    // Append du modal sur le <main>.globalMain sinon sur le <body>
    const modalDomElem = (this.modalRef.hostView as any).rootNodes[0];
    const mainEl = document.querySelector('main .globalMain');
    if (mainEl) {
      mainEl.appendChild(modalDomElem);
    } else {
      // En cas d'absence de <main>.globalMain, on retombe sur le body
      console.warn('Élément <main> introuvable, on append quand même sur le body');
      document.body.appendChild(modalDomElem);
    }

    // Ajoute une classe pour l'animation "fadeIn"
    modalDomElem.classList.add('modal-opening');

    // Instancie dynamiquement le composant passé
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.modalRef.instance.viewContainerRef;
    viewContainerRef.clear();

    // Créer le composant et capturer sa référence
    const componentRef = viewContainerRef.createComponent(factory);

    // Passer les données via @Input() (au modale et à l'enfant du modale)
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        // … données pour le modal container
        if (key in this.modalRef!.instance) {
          (this.modalRef!.instance as any)[key] = value;
        }
        // … données pour le composant interne
        if (key in componentRef.instance) {
          (componentRef.instance as any)[key] = value;
        }
      });
      // On déclenche enfin la détection de changements pour faire remonter les @Input() 
      this.modalRef!.changeDetectorRef.detectChanges();
      componentRef.changeDetectorRef.detectChanges();
    }

    // Ajouter un callback sur la fermeture (avec data renvoyé au composant appelant)
    if (onClose) {
      componentRef.instance['onClose'] = onClose;
    }

    console.log('Données transmises au modal :', data);

    // Avoid nav back quand l'User clique sur "précédent" navigateur (close modal à la place)
    history.pushState({ modal: true }, '');
    this.popStateListener = (event: PopStateEvent) => {
      this.closingByPopState = true;
      this.close();
    };
    window.addEventListener('popstate', this.popStateListener);
  }

  close(result?: any): void {

    this._enableBackgroundScroll();

    this.closeSubject.next(result);

    // Avoid nav back quand l'User clique sur "précédent" navigateur (close modal à la place)
    if (this.popStateListener) {
      // **Nettoyage du listener popstate**
      window.removeEventListener('popstate', this.popStateListener);
      this.popStateListener = null;
    }
    if (!this.closingByPopState) {
      history.back(); // **Si on ferme manuellement** (pas via “Précédent”), on retire l’état ajouté
    }
    this.closingByPopState = false;
    
    if (this.modalRef) {
      // Ajoutez la classe d'animation "modal-closing"
      const modalDomElem = (this.modalRef.hostView as any).rootNodes[0] as HTMLElement;
      modalDomElem.classList.remove('modal-opening');
      modalDomElem.classList.add('modal-closing');

      // anim fadeOut puis setTimeOut()
      setTimeout(() => {
        this.appRef.detachView(this.modalRef!.hostView);
        this.modalRef!.destroy();
        this.modalRef = null;
      }, 500);
    }
  }

  /**
  * Gère l'abonnement à close$ pour éviter les doublons.
  */
  subscribeToClose(callback: (result: any) => void): void {
    // Nettoie tout abonnement précédent
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.close$.subscribe(callback);
  }

  private _disableBackgroundScroll(): void {
    // Mémorise la position courante
    this._scrollY = window.scrollY || window.pageYOffset;
    // Fige le body en position fixed (empêche le scroll)...
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${this._scrollY}px`;
    document.body.style.width    = '100%';  // évite un léger « shift »
  }

  private _enableBackgroundScroll(): void {
    // Remet le body en flow normal
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
    // Restaure la position scroll initiale
    window.scrollTo(0, this._scrollY);
  }
}
