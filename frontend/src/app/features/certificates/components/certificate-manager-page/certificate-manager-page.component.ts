import { Component, OnInit } from '@angular/core';
import { Certificate } from '../../models/certificate.model';
import { CertificateService } from '../../services/certificate.service';

@Component({
  selector: 'app-certificate-manager-page',
  templateUrl: './certificate-manager-page.component.html',
  styleUrl: './certificate-manager-page.component.scss'
})
export class CertificateManagerPageComponent implements OnInit{

  certificates: Certificate[] = [];

  constructor(
    private certificateService: CertificateService,
  ) { }

  
  ngOnInit(): void {
    // TODO load liste complète 
    this.loadUserCertificates();
  }

  private loadUserCertificates(): void {
    this.certificateService.getCurrentUserCertificates().subscribe({
      next: (certificates) => this.certificates = certificates,
      error: (error) => console.error('Failed to load certificates', error)
    });
  }

}
