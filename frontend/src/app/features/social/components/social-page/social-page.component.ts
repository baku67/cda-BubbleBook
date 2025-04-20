import { Component } from '@angular/core';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { UserProfil } from '../../../profil/models/userProfile.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-social-page',
  templateUrl: './social-page.component.html',
  styleUrl: './social-page.component.scss'
})
export class SocialPageComponent {

  currentUser!: UserProfil | null;

  isAnimatingFadeOut = false;

  constructor(
    private animationService: AnimationService,
    private route: ActivatedRoute
  ) 
  {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });

    this.currentUser = this.route.snapshot.data['currentUser'];
  }

}
