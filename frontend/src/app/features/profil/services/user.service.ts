import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, filter, Observable, switchMap, tap } from 'rxjs';
import { UserProfil } from '../models/userProfile.model';
import { environment } from '../../../../environments/environments';
import { OtherUserProfil } from '../../social/models/other-user-profil.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<UserProfil | null>(null);
  private cacheTimestamp: number | null = null;
  private cacheDuration = 5 * 60 * 1000; // Cache 5 minutes

  private readonly apiUrl = `${environment.apiUrl}/api/user`;

  constructor(private http: HttpClient) {}
 
  /**
   * Récupère le profil de l'utilisateur connecté et le met en cache 
   * @param otherUserId - id de l'utilisateur
   * @return OtherUserProfil
   */
  getCurrentUser(forceRefresh: boolean = false): Observable<UserProfil> {
    const now = Date.now();

    // Si on a déjà les données en cache et qu'elles sont récentes, on les retourne directement
    if (!forceRefresh && this.userSubject.value && this.cacheTimestamp && (now - this.cacheTimestamp < this.cacheDuration)) {
      return this.userSubject.asObservable().pipe(filter(user => user !== null));
    }

    // Sinon, on refait un appel API et on met à jour le cache
    return this.http.get<UserProfil>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.userSubject.next(user);
        this.cacheTimestamp = now;
      }),
      switchMap(() => this.userSubject.asObservable().pipe(filter(user => user !== null)))
    );
  }

  /**
   * Force un rafraîchissement des données (ex: après une mise à jour du profil)
   */
  refreshUser(): void {
    this.http.get<UserProfil>(`${this.apiUrl}/me`).subscribe(user => {
      this.userSubject.next(user);
      this.cacheTimestamp = Date.now();
    });
  }

  /**
   * Efface le cache de l'utilisateur connecté (utilisé lors de la déconnexion)
   */
  clearCache(): void {
    this.userSubject.next(null);
    this.cacheTimestamp = null;
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
