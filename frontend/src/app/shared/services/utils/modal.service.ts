import { Injectable, ComponentRef, ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { ModalComponent } from '../../ui-components/modal/modal.component';


@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalRef: ComponentRef<any> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  open(component: any, data?: any): void {
    console.log("Data reçu en paramètre de open() modal.service: " + JSON.stringify(data, null, 2)); // OK

    // Si un modal existe déjà, on le ferme
    if (this.modalRef) {
      this.close();
    }

    // Crée une usine pour le composant ModalComponent
    const modalFactory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);
    this.modalRef = modalFactory.create(this.injector);

    // Attache le composant au cycle de détection
    this.appRef.attachView(this.modalRef.hostView);

    // Ajoute l'élément DOM au `<body>`
    const modalDomElem = (this.modalRef.hostView as any).rootNodes[0];
    document.body.appendChild(modalDomElem);

    // Ajoute une classe pour l'animation "fadeIn"
    modalDomElem.classList.add('modal-opening');

    // Instancie dynamiquement le composant passé
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.modalRef.instance.viewContainerRef;
    viewContainerRef.clear();

    // Créer le composant et capturer sa référence
    const componentRef = viewContainerRef.createComponent(factory);

    // Passer les données via @Input()
    if (data) {
      Object.keys(data).forEach((key) => {
        componentRef.instance[key] = data[key];
      });
    }
  }

  close(): void {
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
}
