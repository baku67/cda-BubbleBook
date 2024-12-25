import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Certificate } from '../../models/certificate.model';
import { Organization } from '../../models/organization.model';
import { CertificateService } from '../../services/certificate.service';

@Component({
  selector: 'app-certificate-form',
  templateUrl: './certificate-form.component.html',
  styleUrl: './certificate-form.component.scss'
})
export class CertificateFormComponent {

    // @Input() organisations!: Organization[]; 
    organisations: Organization[] = 
    [
      {
        id: 1,
        name: "PADI"
      },
      {
        id: 2,
        name: "FFESSM"
      }
    ];
  
    @Input() certificates: Certificate[] = []; 
    // certificates: Certificate[] = 
    // [
    //   {
    //     id: 1,
    //     name: "OpenWater",
    //     type: "PADI",
    //   },
    //   {
    //     id: 2,
    //     name: "Advanced OpenWater",
    //     type: "PADI",
    //   },
    // ];

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
    console.log(this.certificates);
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
