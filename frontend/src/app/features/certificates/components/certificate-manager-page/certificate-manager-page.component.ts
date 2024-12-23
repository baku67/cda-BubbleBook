import { Component, OnInit } from '@angular/core';
import { Certificate } from '../../models/certificate.model';
import { CertificateService } from '../../services/certificate.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { UserCertificate } from '../../models/userCertificate.model';

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

  constructor(
    private certificateService: CertificateService,
  ) {
    this.isAllCertifsLoading = true;
    this.isUserCertifsLoading = true;
  }

  // cdk drag-drop dans list certifs
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.userCertificates, event.previousIndex, event.currentIndex);
  }
  
  ngOnInit(): void {
    // TODO load liste complète 
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
        console.error('Failed to load userzzzz certificates', error);
        this.isAllCertifsLoading = false;
      }
    });
  }

  trackByCertificateId(index: number, userCertif: UserCertificate): number | string {
    return userCertif.certificateId; 
  }

  public addCertificate() {

  }

}
