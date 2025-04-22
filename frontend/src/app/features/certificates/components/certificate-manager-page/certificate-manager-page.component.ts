import { Component, OnInit } from '@angular/core';
import { Certificate } from '../../models/certificate.model';
import { CertificateService } from '../../services/certificate.service';
import { CdkDragDrop,moveItemInArray } from '@angular/cdk/drag-drop';
import { UserCertificate } from '../../models/userCertificate.model';
import { ModalService } from '../../../../shared/services/utils/modal.service';
import { CertificateFormComponent } from '../certificate-form/certificate-form.component';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';

@Component({
  selector: 'app-certificate-manager-page',
  templateUrl: './certificate-manager-page.component.html',
  styleUrl: './certificate-manager-page.component.scss'
})
export class CertificateManagerPageComponent implements OnInit{

  isAllCertifsLoading : boolean;
  isUserCertifsLoading : boolean;
  allCertificates: Certificate[] = [];
  userCertificates: UserCertificate[] = [];

  isDeleting: { [id: number]: boolean } = {};
  isEditMode: boolean = false;
  originalOrder: { id: number, displayOrder: number }[] = []; // Pour pouvoir stocke l'ordre initial
  originalUserCertificates: UserCertificate[] = []; // Pour restaurer si cancel

  isAnimatingFadeOut = false;

  constructor(
    private certificateService: CertificateService,
    private modalService: ModalService,
    private animationService: AnimationService,
    private translateService: TranslateService,
    private flashMessageService: FlashMessageService,
  ) {
    this.isAllCertifsLoading = true;
    this.isUserCertifsLoading = true;
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }

  ngOnInit(): void {
    this.loadCertificates();
    this.loadUserCertificates();
  }

  private loadCertificates(): void {
    this.certificateService.getCertificates().subscribe({
      next: (certificates) => {
        this.allCertificates = certificates;
        this.isAllCertifsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load globals certificates', error);
        this.isAllCertifsLoading = false;
      }
    });
  }

  private loadUserCertificates(): void {
    this.certificateService.getCurrentUserCertificates().subscribe({
      next: (certificates) => {
        this.userCertificates = certificates.sort((a, b) => a.displayOrder - b.displayOrder); // sortBy displayOrder
        this.isUserCertifsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load users certificates', error);
        this.isAllCertifsLoading = false;
      }
    });
  }

  toggleEditMode() {
    if (!this.isEditMode) {
      // Avant d'activer l'édition, on stocke l'ordre initial (pour comparer si modifs)
      this.originalOrder = this.userCertificates.map(cert => ({
        id: cert.id,
        displayOrder: cert.displayOrder
      }));
      // Stocke une copie complète pour restaurer en cas d'annulation (revert aussi le fav)
      this.originalUserCertificates = JSON.parse(JSON.stringify(this.userCertificates));
    } else {
      this.saveCertificateOrder();
    }

    this.isEditMode = !this.isEditMode;
  }

  revertReorderCertifs(): void {
    // Restaure la liste complète des certificats pour éviter l'erreur
    this.userCertificates = JSON.parse(JSON.stringify(this.originalUserCertificates));
    this.isEditMode = false;
  }

  saveCertificateOrder(): void {
    const updatedOrder = this.userCertificates.map((cert, index) => ({
      id: cert.id,
      displayOrder: index + 1
    }));

    // Vérifier si l’ordre a changé avant d’envoyer la requête (early return)
    if (JSON.stringify(this.originalOrder) === JSON.stringify(updatedOrder)) {
      console.log('No changes detected, skipping request.');
      return;
    }

    this.certificateService.updateUserCertificatesOrder(updatedOrder).subscribe({
      next: () => {
        this.flashMessageService.success('CERTIFS_REORDER_SUCCESS');
      },
      error: () => {
        this.flashMessageService.error('CERTIFS_REORDER_ERROR');
      },
    });
  }

  openAddCertifModal(): void {
    this.modalService.open(CertificateFormComponent, {
      modalIcon: "workspace_premium",
      certificates: this.allCertificates,
      userCertificates: this.userCertificates,
    });

    this.modalService.subscribeToClose((createdCertificate: UserCertificate) => {
      if (createdCertificate) {
        this.userCertificates = [...this.userCertificates, createdCertificate];
        console.log("Nouvelle liste de userCertifs :", this.userCertificates);
      }
    });
  }

  deleteCertificate(userCertif: UserCertificate): void {

    // Activer le spinner pour ce certificat
    this.isDeleting[userCertif.certificate.id] = true;

    this.certificateService.deleteUserCertificate(userCertif.certificate.id).subscribe({
      next: () => {
        // Supprimer l'élément localement après la suppression réussie
        this.userCertificates = this.userCertificates.filter(
          cert => cert.certificate.id !== userCertif.certificate.id
        );
        this.isDeleting[userCertif.certificate.id] = false;
        console.log('Certificate deleted successfully');
      },
      error: (err) => {
        this.isDeleting[userCertif.certificate.id] = false;
        console.error('Error while deleting certificate:', err);
      },
    });
  }

  // cdk drag-drop dans list certifs
  drop(event: CdkDragDrop<UserCertificate[]>) {
    moveItemInArray(this.userCertificates, event.previousIndex, event.currentIndex);
  }
  
  trackByCertificateId(index: number, userCertif: UserCertificate): number | string {
    return userCertif.certificate.id || index;
  }

}
