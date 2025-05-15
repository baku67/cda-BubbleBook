import { Component } from '@angular/core';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { UserProfil } from '../../../profil/models/userProfile.model';
import { ActivatedRoute } from '@angular/router';
import { SocialTabStateService } from '../../services/social-tab-state.store';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-social-page',
  templateUrl: './social-page.component.html',
  styleUrl: './social-page.component.scss'
})
export class SocialPageComponent {

  currentUser!: UserProfil | null;

  selectedIndex = 0;

  isAnimatingFadeOut = false;

  constructor(
    private animationService: AnimationService,
    private route: ActivatedRoute,
    private tabState: SocialTabStateService
  ) 
  {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });

    this.currentUser = this.route.snapshot.data['currentUser'];
  }

  ngOnInit(): void {
    // Au chargement du composant, on récupère l’index sauvegardé (default 0)
    this.tabState.tabIndex$.subscribe(idx => this.selectedIndex = idx);
  }

  onTabChange(event: MatTabChangeEvent) {
    // Dès que l’utilisateur change d’onglet, on met à jour le service
    this.tabState.set(event.index);
  }

}
