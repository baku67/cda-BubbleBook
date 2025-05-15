import { Component } from '@angular/core';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';
import { NotificationService } from '../../services/notification.service';
import { FriendService } from '../../../social/services/friend.service';
import { Friendship } from '../../../social/models/friendship.model';
import { COUNTRIES_DB } from '@angular-material-extensions/select-country';
import { finalize, map } from 'rxjs';
import { FriendshipStatus } from '../../../social/models/friend-request-status.enum';

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent {

    friendRequests: Friendship[] = [];
    friendRequestLoading = true;

    // TODO:
    notifications: any[] = [];
    notificationsLoading = false;

    userNotVerified: boolean = false;

    isAnimatingFadeOut = false;

    constructor(
      private animationService: AnimationService,
      private flashMessageService: FlashMessageService,
      private notificationService: NotificationService,
      private friendService: FriendService
    ) {
      this.animationService.isAnimating$.subscribe((animating) => {
        this.isAnimatingFadeOut = animating;
      });
    }

    ngOnInit(): void {
      this.loadFriendRequests();
    }

    private loadFriendRequests() {
      this.friendRequestLoading = true;

      this.friendService.getUserPendingFriendRequests(FriendshipStatus.Pending)
        .pipe(
          map(friendRequests => this.updateCountryInfoForUsers(friendRequests))
        )
        .subscribe({
          next: (friendRequests) => {
            this.friendRequests = friendRequests;
            this.friendRequestLoading = false;
          },
          error: (error) => {
            if(error.status === 403) {
              this.userNotVerified = true; // affiche un app-alert
            } else {
              this.flashMessageService.error("Impossible de charger les demandes d'amis");
            }
            this.friendRequestLoading = false;
          }
        })
    }

    private updateCountryInfoForUsers(friendRequests: Friendship[]): Friendship[] {
      return friendRequests.map(friendReq => {
        if (friendReq.emitterNationality) {
          const country = COUNTRIES_DB.find(c => c.alpha3Code === friendReq.emitterNationality);
          if (country) {
            return {
              ...friendReq,
              countryName: country.name,
              flagSvgUrl: `assets/svg-country-flags/svg/${country.alpha2Code.toLowerCase()}.svg`
            };
          }
        }
        return {
          ...friendReq,
          countryName: 'Inconnu',
          flagSvgUrl: `assets/images/default-flag.png`
        };
      });
    }

    acceptFriendRequest(friendRequest: Friendship) {
      // spinner btn accept
      friendRequest.isLoading = true;
      friendRequest.actionLoading = 'accept';

      this.friendService.acceptFriendRequest(friendRequest.friendshipId)
        .pipe(finalize(() => {
          // reset des flags à la fin
          friendRequest.isLoading = false;
          friendRequest.actionLoading = undefined;
        }))
        .subscribe({
          next: () => {
            this.flashMessageService.success(`Vous êtes désormais amis avec ${friendRequest.emitterUsername} !`);
            this.loadFriendRequests()
          },
          error: (error) => {
            this.flashMessageService.error("Impossible d'accepter la demande d'amis");
          }
        });
    }
    rejectFriendRequest(friendRequest: Friendship) {
      // spinner btn reject
      friendRequest.isLoading = true;
      friendRequest.actionLoading = 'reject';

      this.friendService.rejectFriendRequest(friendRequest.friendshipId)
        .pipe(finalize(() => {
          // reset des flags à la fin
          friendRequest.isLoading = false;
          friendRequest.actionLoading = undefined;
        }))
        .subscribe({
          next: () => {
            this.flashMessageService.success(`Vous avez refusé la demande d'amis de ${friendRequest.emitterUsername} !`);
            this.loadFriendRequests();
          },
          error: (err) => {
            this.flashMessageService.error("Impossible de refuser la demande d'amis");
          }
        });
    }
}
