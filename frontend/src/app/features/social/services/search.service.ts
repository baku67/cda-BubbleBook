import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { UserSearchResults } from '../models/UserSearchResults';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private readonly apiUrl = `${environment.apiUrl}`;
  
  constructor(private http: HttpClient) {}

  search(entity: 'users' | 'clubs', searchString: string): Observable<UserSearchResults[]> {
    const params = new HttpParams().set('search', searchString);
    return this.http.get<UserSearchResults[]>(`${environment.apiUrl}/api/${entity}/search`, { params }).pipe(
      map(users => users || []),
      catchError(error => {
        console.error(`Erreur lors de la recherche des ${entity}s`, error);
        return throwError(() => new Error(`Erreur lors de la recherche des ${entity}s.`));
      })
    );
  }
}