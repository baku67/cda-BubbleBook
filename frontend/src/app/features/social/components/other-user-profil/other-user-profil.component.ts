import { Component, OnInit } from '@angular/core';
import { OtherUserProfil } from '../../models/other-user-profil.model';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FriendService } from '../../services/friend.service';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';

@Component({
  selector: 'app-other-user-profil',
  templateUrl: './other-user-profil.component.html',
  styleUrl: './other-user-profil.component.scss'
})
export class OtherUserProfilComponent implements OnInit {

  otherUser$ = new BehaviorSubject<OtherUserProfil | null>(null);

  isSendingRequest = false;
  isSendingRemoveRequest = false;
  isAnimatingFadeOut = false;

  constructor(
    private animationService: AnimationService,
    private route: ActivatedRoute,
    private router: Router,
    private friendService: FriendService,
    private flashMessageService: FlashMessageService,
  ) {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }

  ngOnInit(): void {
    // ✅(resolver incroyable) Récupération de l'utilisateur préchargé 
    // Transformer la donnée en Observable pour être compatible avec app-user-card
    const user = this.route.snapshot.data['otherUser'];
    this.otherUser$.next(user); // ✅ Met à jour immédiatement le BehaviorSubject 
  }

  
  // Clique sur “envoyer une demande d’ami”.
  public sendFriendRequest(): void {
    const other = this.otherUser$.value;
    if (!other) {
      console.error('Autre utilisateur indisponible');
      return;
    }

    this.isSendingRequest = true;
    this.friendService
      .sendFriendRequest(other.id)
      .subscribe({
        next: () => {
          this.isSendingRequest = false;
          this.flashMessageService.success('Demande d’ami envoyée !');
          // Màj du BehaviorSubject
          const updatedUser: OtherUserProfil = {
            ...other,
            friendshipStatus: 'PENDING'
          };
          this.otherUser$.next(updatedUser);
        },
        error: (err) => {
          if(err.status === 409) {
            this.flashMessageService.error('Une demande d\'ajout existe déjà entre vous 2.');
          }
          else if(err.status === 403) {
            this.flashMessageService.error('Vous devez valider votre adresse mail pour envoyer une demande d\'amis');
          }
          else {
            this.flashMessageService.error('Impossible d’envoyer la demande. Réessayez plus tard.');
          }
          this.isSendingRequest = false;
        }
      });
  }


    // Clique sur "retirer des amis".
  public sendFriendRemoveRequest(): void {
    const other = this.otherUser$.value;
    if (!other) {
      console.error('Autre utilisateur indisponible');
      return;
    }

    this.isSendingRemoveRequest = true;
    this.friendService
      .sendFriendRemoveRequest(other.id)
      .subscribe({
        next: () => {
          this.flashMessageService.success(`Vous n\'êtes plus ami avec ${other.username} !`);
          this.isSendingRemoveRequest = false;
          // Màj du BehaviorSubject
          const updatedUser: OtherUserProfil = {
            ...other,
            friendshipStatus: 'none'
          };
          this.otherUser$.next(updatedUser);
        },
        error: (err:any) => {
          this.flashMessageService.error('Impossible de retirer des amis. Réessayez plus tard.');
          this.isSendingRemoveRequest = false;
        }
      });
  }

  navigate404(): void {
    this.router.navigate(['/not-implmented-yet']);
  }
}
