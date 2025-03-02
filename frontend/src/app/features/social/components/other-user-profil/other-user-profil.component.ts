import { Component, Input, OnInit } from '@angular/core';
import { OtherUserProfil } from '../../models/other-user-profil.model';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Component({
  selector: 'app-other-user-profil',
  templateUrl: './other-user-profil.component.html',
  styleUrl: './other-user-profil.component.scss'
})
export class OtherUserProfilComponent implements OnInit {

  user$ = new BehaviorSubject<OtherUserProfil | null>(null);

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
    // Transformer la donnée en Observable pour être compatible avec app-user-card
    const user = this.route.snapshot.data['user'];
    this.user$.next(user); // ✅ Met à jour immédiatement le BehaviorSubject 
  }
}
