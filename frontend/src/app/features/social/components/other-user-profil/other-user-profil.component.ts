import { Component, Input, OnInit } from '@angular/core';
import { OtherUserProfil } from '../../models/OtherUserProfil';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-other-user-profil',
  templateUrl: './other-user-profil.component.html',
  styleUrl: './other-user-profil.component.scss'
})
export class OtherUserProfilComponent implements OnInit {

  user!: OtherUserProfil | null;

  isAnimatingFadeOut = false;

  constructor(
    private animationService: AnimationService,
    private route: ActivatedRoute
  ) {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }

  ngOnInit(): void {
    // ✅(resolver incroyable) Récupération de l'utilisateur préchargé 
    this.route.data.subscribe(data => {
      this.user = data['user']; 
      console.log(this.user);
    });
  }
}
