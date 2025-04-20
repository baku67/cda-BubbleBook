import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { UserDivelog } from '../models/UserDivelog.model';


@Injectable({
  providedIn: 'root'
})
export class DivelogService {

  constructor(private http: HttpClient) { }
 
  getCurrentUserDivelogs(): Observable<UserDivelog[]> {
    return this.http.get<UserDivelog[]>(`${environment.apiUrl}/api/me/divelogs`);
  }

}