import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class EmailCheckService {
  
  // API check email used (voir environemnt.ts pour switch mobile debug):
  private apiUrl = `${environment.apiUrl}/api/check-email-exist`;

  constructor(private http: HttpClient) {}

  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.post<{ exists: boolean }>(this.apiUrl, { email });
  }
}