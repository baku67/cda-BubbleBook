import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfil } from '../models/userProfile.model';
import { environment } from '../../../../environments/environments';
import { OtherUserProfil } from '../../social/models/OtherUserProfil';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = `${environment.apiUrl}/api/user`;

  constructor(private http: HttpClient) {}
 
  getCurrentUser(): Observable<UserProfil> {
    return this.http.get<UserProfil>(`${this.apiUrl}/me`);
  }

  /**
   * Met à jour l'utilisateur avec les paramètres de confidentialité
   * @param updateData - Données à envoyer au backend (l'User)
   * @return UserProfil
   */
  updateUserPrivacy(updateData: Record<string, unknown>): Observable<UserProfil> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<UserProfil>(`${this.apiUrl}/privacy`, updateData, { headers });
  }

  /**
   * Récupère le profil d'un autre utilisateur
   * @param otherUserId - id de l'utilisateur
   * @return OtherUserProfil
   */
  getOtherUserProfil(otherUserId: string): Observable<OtherUserProfil> {
    return this.http.get<OtherUserProfil>(`${this.apiUrl}/${otherUserId}`);
  }

}
