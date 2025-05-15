import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }
 
//   getCurrentUserNotifications(): Observable<Notification> {
//     return this.http.get<Notification>(`${environment.apiUrl}/api/me/notifications`);
//   }

}