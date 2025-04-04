import { Component, OnInit } from '@angular/core';
import { UserProfil } from '../../models/userProfile.model';
import { UserService } from '../../services/user.service';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent implements OnInit {

    user$!: Observable<UserProfil | null>;

    isUserLoading = true;

    isAnimatingFadeOut = false;

    constructor(
      private userService: UserService, 
      private animationService: AnimationService,
    ) {
      this.animationService.isAnimating$.subscribe((animating) => {
        this.isAnimatingFadeOut = animating;
      });
    }

    ngOnInit(): void { 
      this.user$ = this.userService.getCurrentUser();
    }
}
