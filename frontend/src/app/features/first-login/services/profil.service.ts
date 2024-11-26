import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  constructor(private http: HttpClient) { }


  firstLoginForm(registerData: unknown): Observable<unknown> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${environment.apiUrl}/api/firstLoginUpdate`,
       registerData,
       { headers }
    );
  }
}
