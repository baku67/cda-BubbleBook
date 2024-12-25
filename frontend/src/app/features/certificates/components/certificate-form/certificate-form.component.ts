import { Component } from '@angular/core';
import { Certificate } from '../../models/certificate.model';
import { Organization } from '../../models/organization.model';

@Component({
  selector: 'app-certificate-form',
  templateUrl: './certificate-form.component.html',
  styleUrl: './certificate-form.component.scss'
})
export class CertificateFormComponent {

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
  ]

  certificates: Certificate[] = 
  [
    {
      id: 1,
      name: "OpenWater",
      type: "PADI",
    },
    {
      id: 2,
      name: "Advanced OpenWater",
      type: "PADI",
    },
  ]

}
