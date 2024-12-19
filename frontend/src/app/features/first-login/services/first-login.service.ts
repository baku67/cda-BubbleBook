import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { FirstLoginUserUpdate1 } from '../models/first-login-1.model';
import { FirstLoginUserUpdate2 } from '../models/first-login-2.model';


@Injectable({
  providedIn: 'root'
})
export class FirstLoginService {

  constructor(private http: HttpClient) { }


  firstLoginForm(registerData: FirstLoginUserUpdate1): Observable<unknown> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${environment.apiUrl}/api/firstLoginUpdate`,
       registerData,
       { headers }
    );
  }

  firstLoginForm2(registerData: FirstLoginUserUpdate2): Observable<unknown> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${environment.apiUrl}/api/firstLoginUpdate2`,
       registerData,
       { headers }
    );
  }
}
