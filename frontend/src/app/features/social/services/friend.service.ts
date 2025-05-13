import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

    private readonly apiUrl = `${environment.apiUrl}`;
  
    constructor(
        private http: HttpClient
    ) {}

    /**
     * Envoie une requête POST pour créer une amitié avec l'utilisateur {recipientId}.
     */
    public sendFriendRequest(recipientId: string): Observable<void> {
        return this.http.post<void>(
            `${this.apiUrl}/api/friendship/request/${recipientId}`,
            {} // pas de payload, tout est dans l’URL
        );
    }

    /**
     * Envoie une requête DELETE pour supprimer une amitié avec l'utilisateur {recipientId}.
     */
    public sendFriendRemoveRequest(recipientId: string): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/api/friendship/request/${recipientId}`,
            {} // pas de payload, tout est dans l’URL
        );
    }

}