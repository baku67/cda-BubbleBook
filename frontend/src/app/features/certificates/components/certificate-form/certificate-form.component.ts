import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Certificate } from '../../models/certificate.model';
import { CertificateService } from '../../services/certificate.service';
import { UserCertificate } from '../../models/userCertificate.model';
import { DateValidator } from '../../../../shared/validators/dateValidator';
import { ModalService } from '../../../../shared/services/utils/modal.service';

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
    today: Date = new Date();
    errorMessage: string | null = null;
    
    constructor(
      private formBuilder: FormBuilder, 
      private modalService: ModalService,
      private certificateService: CertificateService,
      private router: Router,
    ) {}


    ngOnInit() {
      this.addCertificateForm = this.formBuilder.group({
        organisationValue: ['', [Validators.required]], 
        certificateValue: ['', [Validators.required]], 
        obtainedDate: [null, [DateValidator.pastDateValidator()]],
        location: [null]
      });

      // Surveille les changements dans le champ organisationValue
      this.addCertificateForm.get('organisationValue')?.valueChanges.subscribe((selectedOrganisation) => {
        this.filterCertificates(selectedOrganisation);
      });
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
            this.router.navigate(['/certificates']).then(() => {
              window.location.reload();
            });
            this.isLoading = false;
            this.modalService.close();
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
