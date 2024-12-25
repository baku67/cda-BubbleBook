import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { Certificate } from '../models/certificate.model';
import { UserCertificate } from '../models/userCertificate.model';
import { CertificateFormData } from '../models/certificateFormData.model';


@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private http: HttpClient) { }

  getCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${environment.apiUrl}/api/certificates`);
  }
 
  getCurrentUserCertificates(): Observable<UserCertificate[]> {
    return this.http.get<UserCertificate[]>(`${environment.apiUrl}/api/user/certificates`);
  }

  addCertificateToUser(data: CertificateFormData): Observable<unknown> {

    return new Observable;
  }



}
