import { Component } from '@angular/core';
import { UserProfil } from '../../../profil/models/userProfile.model';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { ActivatedRoute } from '@angular/router';
import { DivelogService } from '../../services/divelog.service';
import { UserDivelog } from '../../models/UserDivelog.model';

@Component({
  selector: 'app-divelog-page',
  templateUrl: './divelog-page.component.html',
  styleUrl: './divelog-page.component.scss'
})
export class DivelogPageComponent {

  currentUser!: UserProfil | null;

  isAnimatingFadeOut = false;

  userDivelogs: UserDivelog[] = [];
  isUserDivelogsLoading: boolean = true;

  constructor(
    private animationService: AnimationService,
    private route: ActivatedRoute,
    private divelogService: DivelogService,
  ) 
  {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });

    this.currentUser = this.route.snapshot.data['currentUser'];

    this.loadUserDivelogs();
  }

  private loadUserDivelogs(): void {
    this.divelogService.getCurrentUserDivelogs().subscribe({
      next: (divelogs) => {
        this.userDivelogs = divelogs; 
        this.isUserDivelogsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load users divelogs', error);
        this.isUserDivelogsLoading = false;
      }
    });
  }


}
