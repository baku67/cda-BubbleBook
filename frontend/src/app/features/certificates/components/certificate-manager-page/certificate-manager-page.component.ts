import { Component, OnInit } from '@angular/core';
import { Certificate } from '../../models/certificate.model';
import { CertificateService } from '../../services/certificate.service';
import { CdkDragDrop,moveItemInArray } from '@angular/cdk/drag-drop';
import { UserCertificate } from '../../models/userCertificate.model';
import { ModalService } from '../../../../shared/services/utils/modal.service';
import { CertificateFormComponent } from '../certificate-form/certificate-form.component';
import { AnimationService } from '../../../../shared/services/utils/animation.service';

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

  isAnimatingFadeOut = false;

  constructor(
    private certificateService: CertificateService,
    private modalService: ModalService,
    private animationService: AnimationService,
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
        this.userCertificates = certificates;
        this.isUserCertifsLoading = false;
        // this.cdr.detectChanges(); // Force l'actualisation
      },
      error: (error) => {
        console.error('Failed to load users certificates', error);
        this.isAllCertifsLoading = false;
      }
    });
  }


  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  openAddCertifModal(): void {
    this.modalService.open(CertificateFormComponent, {
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
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.userCertificates, event.previousIndex, event.currentIndex);
  }
  
  trackByCertificateId(index: number, userCertif: UserCertificate): number | string {
    return userCertif.certificate.id || index;
  }

}
