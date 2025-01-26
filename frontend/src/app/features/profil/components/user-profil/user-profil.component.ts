import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserProfil } from '../../models/userProfile.model';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { AnimationService } from '../../../../shared/services/utils/animation.service';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrl: './user-profil.component.scss'
})
export class UserProfilComponent implements OnInit{

  user?:UserProfil;

  isUserLoading = true;

  emailConfirmResent = false;
  emailConfirmResentLoading = false;

  isAnimatingFadeOut = false;

  constructor(
    private userService: UserService, 
    private authService: AuthService,
    private router: Router,
    private animationService: AnimationService,
  ) {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }

  ngOnInit(): void { 
    this.userService.getCurrentUser().subscribe({ 
      next: (userData: UserProfil) => {
        this.user = userData;
        this.isUserLoading = false;
      },
      error: (error: unknown) => {
        console.error('Erreur lors de la récupération du profil utilisateur', error);
        this.isUserLoading = false;
      }
    });
  }


  navigateCertificates(): void {
    this.router.navigate(['/certificates']);
  }
}
