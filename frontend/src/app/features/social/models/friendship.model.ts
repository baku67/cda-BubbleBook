import { FriendshipStatus } from "./friend-request-status.enum";

// Sert pour les friendRequest et les FriendLists
export interface Friendship {
  friendshipId: string;
  emitterId: string; // Dans le cadre des Friendship.status = ACCEPTED (Amis), l'emitter est l'autre User forcément
  emitterUsername: string;
  emitterAvatarUrl: string;
  emitterBannerUrl: string;
  emitterNationality: string;
  status: FriendshipStatus; 
  sentAt: string; 
  message?: string; // message optionnel 

  countryName?: string; // calculé dans le composant (lib)
  flagSvgUrl?: string; // calculé dans le composant (lib)

  // Pour le chargement des actions (FriendRequests)
  isLoading?: boolean;
  actionLoading?: 'accept' | 'reject';
}
