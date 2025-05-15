import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { FriendRequest } from '../models/friend-request.model';
import { FriendshipStatus } from '../models/friend-request-status.enum';

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
        return this.http.delete<void>(`${this.apiUrl}/api/friendship/request/${recipientId}`);
    }


    /**
     * Envoie une requête GET pour récupérer les demande d'amis (selon status en paramètre) dont l'utilisateur connecté est récepteur.
     */
    public getUserPendingFriendRequests(status: FriendshipStatus): Observable<FriendRequest[]> {
        const params = new HttpParams().set("status", status);
        return this.http.get<FriendRequest[]>(
            `${this.apiUrl}/api/friendship/request`,
            { params }
        );
    }

    // accept FriendRequest
    public acceptFriendRequest(friendshipId: string): Observable<void> {
    return this.http.patch<void>(
        `${this.apiUrl}/api/friendship/${friendshipId}/accept`,
        {}
    );
    }

    // reject FriendRequest
    public rejectFriendRequest(friendshipId: string): Observable<void> {
    return this.http.patch<void>(
        `${this.apiUrl}/api/friendship/${friendshipId}/reject`,
        {}
    );
    }
}