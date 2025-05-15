import { FriendshipStatus } from "./friend-request-status.enum";

// Sert pour les friendRequest et les FriendLists
export interface FriendRequest {
  friendshipId: string;
  emitterId: string;
  emitterUsername: string;
  emitterAvatarUrl: string;
  emitterBannerUrl: string;
  emitterNationality: string;
  status: FriendshipStatus; 
  sentAt: string; 

  countryName?: string; // calculé dans le composant (lib)
  flagSvgUrl?: string; // calculé dans le composant (lib)

  // Pour le chargement des actions (FriendRequests)
  isLoading?: boolean;
  actionLoading?: 'accept' | 'reject';
}
