export interface FriendRequest {
  friendshipId: string;
  emitterId: string;
  emitterUsername: string;
  emitterAvatarUrl: string;
  emitterBannerUrl: string;
  emitterNationality: string;
  status: string;      // 'pending'
  sentAt: string; 

  countryName?: string; 
  flagSvgUrl?: string;
}
