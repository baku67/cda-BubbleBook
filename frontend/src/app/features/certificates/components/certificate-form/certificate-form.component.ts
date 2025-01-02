import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Certificate } from '../../models/certificate.model';
import { CertificateService } from '../../services/certificate.service';
import { UserCertificate } from '../../models/userCertificate.model';

@Component({
  selector: 'app-certificate-form',
  templateUrl: './certificate-form.component.html',
  styleUrl: './certificate-form.component.scss'
})
export class CertificateFormComponent {

    // @Input() organisations!: Organization[]; 
    organisations: string[] = 
    [
      "PADI",
      "FFESSM",
    ];
  
    @Input() certificates: Certificate[] = []; // Tous les certifs
    @Input() userCertificates: UserCertificate[] = []; // Les certificats du l'user
    filteredCertificates: Certificate[] = []; // Certifs filtrés selon organisme

    addCertificateForm!: FormGroup;
    isLoading = false;
    errorMessage: string | null = null;
    
    constructor(
      private formBuilder: FormBuilder, 
      private certificateService: CertificateService,
      private router: Router,
    ) {}


    ngOnInit() {
      this.addCertificateForm = this.formBuilder.group({
        organisationValue: ['', [Validators.required]], 
        certificateValue: ['', [Validators.required]], 
        //
        //
      });

      // Surveillez les changements dans le champ organisationValue
      this.addCertificateForm.get('organisationValue')?.valueChanges.subscribe((selectedOrganisation) => {
        this.filterCertificates(selectedOrganisation);
      });
      // Initialiser les certificats filtrés avec un tableau vide ou la valeur par défaut
      this.filteredCertificates = [];
    }


    // Filtrage des options du select certificats (selon oirganisme et certificats deja en possession de l'user)
    filterCertificates(selectedOrganisation: string): void {
      const userCertificateIds = this.userCertificates.map((uc) => uc.certificateId);
    
      this.filteredCertificates = this.certificates.filter(
        (certificate) =>
          certificate.type === selectedOrganisation && // Correspond à l'organisation sélectionnée
          !userCertificateIds.includes(certificate.id) // N'est pas déjà possédé par l'utilisateur
      );
    }

  
    onSubmit(): void {
      if (this.addCertificateForm.valid) {
        this.isLoading = true;
        // this.errorMessage = null;

        this.certificateService.addCertificateToUser(this.addCertificateForm.value).subscribe({
          next: () => {
            this.router.navigate(['/certificates']);
            this.isLoading = false;
          },
          error: (error:any) => {
            console.error('There was an error during the request (addCertificateToUser)', error);
            this.errorMessage = 'There was an error adding a certificate. Try again later';
            this.isLoading = false;
          }
        });
      } else {
        console.error('Form is invalid');
        this.errorMessage = 'Please fill in all required fields correctly.';
      }
    }

}
