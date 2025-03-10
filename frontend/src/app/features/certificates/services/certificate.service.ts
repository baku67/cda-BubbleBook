import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  addCertificateToUser(certificateData: CertificateFormData): Observable<unknown> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${environment.apiUrl}/api/user/certificates`,
      certificateData,
       { headers }
    );
  }

  deleteUserCertificate(certificateId: number): Observable<unknown> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(
      `${environment.apiUrl}/api/user/certificates/${certificateId}`,
      { headers }
    );
  }

  updateUserCertificatesOrder(updatedOrder: { id: number, displayOrder: number }[]): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<void>(
      `${environment.apiUrl}/api/user/certificates/order`,
      { certificates: updatedOrder },
      { headers }
    );
  }

}
