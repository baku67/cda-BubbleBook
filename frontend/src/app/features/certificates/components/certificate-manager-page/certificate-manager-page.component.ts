import { Component, OnInit } from '@angular/core';
import { Certificate } from '../../models/certificate.model';
import { CertificateService } from '../../services/certificate.service';

@Component({
  selector: 'app-certificate-manager-page',
  templateUrl: './certificate-manager-page.component.html',
  styleUrl: './certificate-manager-page.component.scss'
})
export class CertificateManagerPageComponent implements OnInit{

  allCertificates: Certificate[] = [];
  userCertificates: Certificate[] = [];

  constructor(
    private certificateService: CertificateService,
  ) { }

  
  ngOnInit(): void {
    // TODO load liste complète 
    this.loadCertificates();
    this.loadUserCertificates();
  }

  private loadCertificates(): void {
    this.certificateService.getCertificates().subscribe({
      next: (certificates) => this.allCertificates = certificates,
      error: (error) => console.error('Failed to load globalzzz certificates', error)
    });
  }

  private loadUserCertificates(): void {
    this.certificateService.getCurrentUserCertificates().subscribe({
      next: (certificates) => this.userCertificates = certificates,
      error: (error) => console.error('Failed to load userzzzz certificates', error)
    });
  }

}
