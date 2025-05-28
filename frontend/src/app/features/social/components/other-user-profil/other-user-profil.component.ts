import { Component, OnInit } from '@angular/core';
import { OtherUserProfil } from '../../models/other-user-profil.model';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FriendService } from '../../services/friend.service';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';
import { FriendshipStatus } from '../../models/friend-request-status.enum';
import { UserService } from '../../../profil/services/user.service';
import { ModalService } from '../../../../shared/services/utils/modal.service';
import { FriendRequestMessageComponent } from '../friend-request-message/friend-request-message.component';

@Component({
  selector: 'app-other-user-profil',
  templateUrl: './other-user-profil.component.html',
  styleUrl: './other-user-profil.component.scss'
})
export class OtherUserProfilComponent implements OnInit {

  otherUser$ = new BehaviorSubject<OtherUserProfil | null>(null);
  isLoading = false;

  friendshipStatus = FriendshipStatus;

  isSendingRequest = false;
  isSendingRemoveRequest = false;
  isAnimatingFadeOut = false;

  constructor(
    private userService: UserService,
    private friendService: FriendService,
    private animationService: AnimationService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessageService: FlashMessageService,
    private modalService: ModalService
  ) {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getOtherUserProfil(id).subscribe({
        next: (user) => this.otherUser$.next(user),
        error: (err) => 
          {
            if(err.error?.code === 'PRIVACY_FORBIDDEN') {
              this.flashMessageService.error("Le profil de l'utilisateur est privé");
            } else {
              this.flashMessageService.error("Erreur lors du chargement du profil");
            }
            // Les friendRequest s'affichent même si l'emitter est profilPrivacy = privé ducoup ça vient souvent de /notifs: (c'est bof)
            // logiquement on peut que venir de /notifications ou alors on tape des ID randoms dans l'url
            this.router.navigate(["/notifications"]);  
          }
      });
    }
  }

  
  // Clique sur “envoyer une demande d’ami” (modal de saisie du message optionnel)
  sendFriendRequest(): void {
    const otherUser = this.otherUser$.getValue();
    if (!otherUser) return;

    this.isSendingRequest = true;

    this.modalService.open(FriendRequestMessageComponent, {
      modalIcon: 'mail'
    })

    this.modalService.subscribeToClose((data: {choice:boolean, message:string}) => {
      if(data.choice) {
        this.friendService.sendFriendRequest(otherUser.id, data.message).subscribe({
          next: () => {
            const updatedUser: OtherUserProfil = {
              ...otherUser,
              friendshipStatus: FriendshipStatus.Pending
            };
            this.otherUser$.next(updatedUser);
            this.isSendingRequest = false;
          },
          error: (err) => {
            console.error(err);
            this.flashMessageService.error('Impossible d’envoyer la demande. Réessayez plus tard.');
            this.isSendingRequest = false;
          }
        });
      }
      else {
        this.isSendingRequest = false;
        return;
      }
    });
  }


  // Clique sur "retirer des amis".
  public removeFriend(): void {
    const otherUser = this.otherUser$.getValue();
    if (!otherUser) return;

    this.isSendingRemoveRequest = true;
    this.friendService
      .removeFriend(otherUser.id)
      .subscribe({
        next: () => {
          this.flashMessageService.success(`Vous n\'êtes plus ami avec ${otherUser.username} !`);
          this.isSendingRemoveRequest = false;
          // Màj du BehaviorSubject
          const updatedUser: OtherUserProfil = {
            ...otherUser,
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
