import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { Friendship } from '../models/friendship.model';
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
    public sendFriendRequest(recipientId: string, message: string | null): Observable<void> {
        console.log("message:", message);
        return this.http.post<void>(
            `${this.apiUrl}/api/friendship/request/${recipientId}`,
            { message: message }, // message optionnel du modal
        );
    }

    /**
     * Envoie une requête DELETE pour supprimer une amitié avec l'utilisateur {recipientId}.
     */
    public removeFriend(recipientId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/api/friendship/request/${recipientId}`);
    }

    /**
     * Envoie une requête GET pour récupérer les demandes d'amis (selon status en paramètre) dont l'utilisateur connecté est récepteur.
     */
    public getUserFriendRequests(status: FriendshipStatus): Observable<Friendship[]> {
        const params = new HttpParams().set("status", status);
        return this.http.get<Friendship[]>(
            `${this.apiUrl}/api/friendship/request`,
            { params }
        );
    }

    /**
     * Envoie une requête GET pour récupérer le nombre de demandes d'amis (selon status en paramètre) dont l'utilisateur connecté est récepteur.
     */
    public getUserFriendRequestsCount(status: FriendshipStatus): Observable<number> {
        const params = new HttpParams().set("status", status);
        return this.http.get<number>(
            `${this.apiUrl}/api/friendship/count-request`,
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