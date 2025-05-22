import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserProfil } from '../../models/userProfile.model';
import { Router } from '@angular/router';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { catchError, Observable, of } from 'rxjs';
import { FriendService } from '../../../social/services/friend.service';
import { FriendshipStatus } from '../../../social/models/friend-request-status.enum';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrl: './user-profil.component.scss'
})
export class UserProfilComponent implements OnInit{

  user$!: Observable<UserProfil | null>;

  showNotifCount: boolean = false;
  totalNotifCount: string = "";

  isUserLoading = true;

  emailConfirmResent = false;
  emailConfirmResentLoading = false;

  isAnimatingFadeOut = false;

  constructor(
    private userService: UserService, 
    private friendService: FriendService,
    private router: Router,
    private animationService: AnimationService,
  ) {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }

  ngOnInit(): void {
    this.reloadUser();
    this.countNotifs();
  }
  

  private reloadUser(forceRefresh: boolean = false): void {
    this.user$ = this.userService.getCurrentUser(forceRefresh).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du profil', error);
        return of(null);
      })
    );
  }

  private countNotifs(): void {
    let notifsCount = 0;
    this.friendService
      .getUserFriendRequestsCount(FriendshipStatus.Pending)
      .subscribe({
        next: count => {
          notifsCount += count;
          // A deplacer dans un "addition d'observable" (avec le countNotif)
          if(notifsCount > 0 && notifsCount <= 9) {
            this.showNotifCount = true;
            this.totalNotifCount = notifsCount.toString();
          } else if (notifsCount > 9) {
            this.showNotifCount = true;
            this.totalNotifCount = "9+";
          } else if (notifsCount === 0) {
            this.showNotifCount = false;
          }
        },
        error: err  => console.error('Erreur count friend-requests', err)
      });

    // this.notificationService
    //   .getUserNotificationsCount()
    //   .subscribe({
    //     next: count => notifsCount += count,
    //     error: err  => console.error('Erreur count notifs', err)
    //   })

    // ici le calcul de la string
  }

  // Pour le click sur card
  navigateCertificates(): void {
    this.router.navigate(['/certificates']);
  }

  navigateNotifs(): void {
    this.router.navigate(['/notifications']);
  }

  navigate404(): void {
    this.router.navigate(['/not-implmented-yet']);
  }

  goToPrivacySettings() {
    this.router.navigate(
      ['/account-settings'],
      { fragment: 'privacy' }
    );
  }
}
