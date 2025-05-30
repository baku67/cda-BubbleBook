import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { UserProfil } from '../../profil/models/userProfile.model';


@Injectable({
  providedIn: 'root'
})
export class FirstLoginStepsService {

  private readonly apiUrl = `${environment.apiUrl}/api/user`;

  constructor(private http: HttpClient) { }

  /**
   * Met à jour l'utilisateur avec des données spécifiques
   * @param updateData - Données à envoyer au backend
   */
  updateUser(updateData: Record<string, unknown>): Observable<UserProfil> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<UserProfil>(this.apiUrl, updateData, { headers });
  }

  /**
   * Met à jour le first_login_step utilisateur lors du skip step front
   * @param step - Etape à passer (pas en place pour l'instant)
   */
  skipStep(step: number): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<void>(this.apiUrl, { passStep: true, step: step }, { headers });
  }
}
