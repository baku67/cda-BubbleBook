import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailCheckService {
  private apiUrl = 'http://localhost:8000/api/check-email-exist';

  constructor(private http: HttpClient) {}

  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.post<{ exists: boolean }>(this.apiUrl, { email });
  }
}