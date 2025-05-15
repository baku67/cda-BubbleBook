export interface FriendRequest {
  friendshipId: string;
  emitterId: string;
  emitterUsername: string;
  emitterAvatarUrl: string;
  emitterBannerUrl: string;
  emitterNationality: string;
  status: string; // 'pending'
  sentAt: string; 

  countryName?: string; // calculé dans le composant (lib)
  flagSvgUrl?: string; // calculé dans le composant (lib)

  // Pour le chargement des actions
  isLoading?: boolean;
  actionLoading?: 'accept' | 'reject';
}
