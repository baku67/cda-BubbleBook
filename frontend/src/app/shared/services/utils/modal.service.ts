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

  open(component: any): void {
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

    // Instancie dynamiquement le composant passé
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.modalRef.instance.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(factory);
  }

  close(): void {
    if (this.modalRef) {
      this.appRef.detachView(this.modalRef.hostView);
      this.modalRef.destroy();
      this.modalRef = null;
    }
  }
}
