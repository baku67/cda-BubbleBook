import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { Certificate } from '../models/certificate.model';


@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private http: HttpClient) { }
 
  getCurrentUserCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${environment.apiUrl}/api/user/certificates`);
  }

}
