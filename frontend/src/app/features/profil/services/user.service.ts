import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfil } from '../models/userProfile.model';
import { environment } from '../../../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
 
  getUserProfil(): Observable<UserProfil> {
    return this.http.get<UserProfil>(`${environment.apiUrl}/api/user`);
  }

}
