import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
// import { FirstLoginUserUpdate1 } from '../models/first-login-1.model';
// import { FirstLoginUserUpdate2 } from '../models/first-login-2.model';


@Injectable({
  providedIn: 'root'
})
export class FirstLoginService {

  private readonly apiUrl = `${environment.apiUrl}/api/user`;

  constructor(private http: HttpClient) { }


  // firstLoginForm(registerData: FirstLoginUserUpdate1): Observable<unknown> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.patch(
  //     `${environment.apiUrl}/api/user`,
  //      registerData,
  //      { headers }
  //   );
  // }

  // firstLoginForm2(registerData: FirstLoginUserUpdate2): Observable<unknown> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.patch(
  //     `${environment.apiUrl}/api/user`,
  //      registerData,
  //      { headers }
  //   );
  // }

    /**
   * Met à jour l'utilisateur avec des données spécifiques
   * @param updateData - Données à envoyer au backend
   */
    updateUser(updateData: Record<string, unknown>): Observable<unknown> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.patch(this.apiUrl, updateData, { headers });
    }
}
