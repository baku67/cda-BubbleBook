import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { OtherUserProfil } from '../models/OtherUserProfil';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private readonly apiUrl = `${environment.apiUrl}/api/user/search`;
  
  constructor(private http: HttpClient) {}

  searchUsers(searchString: string): Observable<OtherUserProfil[]> {
    return this.http.get<OtherUserProfil[]>(`${this.apiUrl}?search=${searchString}`).pipe(
      map(users => users || []) // Assurer qu'on retourne toujours un tableau 
    );
  }
}