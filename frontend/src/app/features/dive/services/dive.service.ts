import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiveDTO } from '../models/DiveDTO.model';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DiveService {
    
  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des plongées pour un Divelog donné de l'User connecté
   * @param divelogId ID du Divelog de l'User
   */
  getUserDivelogDives(divelogId: number): Observable<DiveDTO[]> {
    const url = `${environment.apiUrl}/api/me/divelogs/${divelogId}/dives`;
    return this.http.get<DiveDTO[]>(url);
  }
}