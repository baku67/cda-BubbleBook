import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { UserDivelog } from '../models/UserDivelog.model';
import { DivelogFormData } from '../models/divelogFormData.model';


@Injectable({
  providedIn: 'root'
})
export class DivelogService {

  constructor(private http: HttpClient) { }
 
  getCurrentUserDivelogs(): Observable<UserDivelog[]> {
    return this.http.get<UserDivelog[]>(`${environment.apiUrl}/api/me/divelogs`);
  }

  getCurrentUserDivelog(divelogId: string): Observable<UserDivelog> {
    return this.http.get<UserDivelog>(`${environment.apiUrl}/api/me/divelogs/${divelogId}`);
  }

  addDivelogToUser(divelogData: DivelogFormData): Observable<unknown> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${environment.apiUrl}/api/me/divelogs`,
      divelogData,
        { headers }
    );
  }

  deleteUserDivelog(divelogId: number): Observable<unknown> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(
      `${environment.apiUrl}/api/me/divelogs/${divelogId}`,
      { headers }
    );
  }

}