import { Component } from '@angular/core';
import { Friendship } from '../../models/friendship.model';
import { FriendService } from '../../services/friend.service';
import { FriendshipStatus } from '../../models/friend-request-status.enum';
import { map } from 'rxjs';
import { COUNTRIES_DB } from '@angular-material-extensions/select-country';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrl: './friends-list.component.scss'
})
export class FriendsListComponent {

    friends: Friendship[] = [];
    friendsLoading = true;

    userNotVerified: boolean = false;

    constructor(
      private friendService: FriendService,
      private flashMessageService: FlashMessageService
    ) {}

    ngOnInit(): void {
      this.loadFriends();
    }

    private loadFriends() {
      this.friendsLoading = true;

      this.friendService.getUserPendingFriendRequests(FriendshipStatus.Accepted)
        .pipe(
          map(friendRequests => this.updateCountryInfoForUsers(friendRequests))
        )
        .subscribe({
          next: (friendRequests) => {
            this.friends = friendRequests;
            this.friendsLoading = false;
          },
          error: (error) => {
            if(error.status === 403) {
              this.userNotVerified = true; // affiche un app-alert
            } else {
              this.flashMessageService.error("Impossible de charger les amis");
            }
            this.friendsLoading = false;
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
}
