import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserProfil } from '../../models/userProfile.model';
import { Router } from '@angular/router';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { catchError, Observable, of } from 'rxjs';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrl: './user-profil.component.scss'
})
export class UserProfilComponent implements OnInit{

  user$!: Observable<UserProfil | null>;

  isUserLoading = true;

  emailConfirmResent = false;
  emailConfirmResentLoading = false;

  isAnimatingFadeOut = false;

  constructor(
    private userService: UserService, 
    private router: Router,
    private animationService: AnimationService,
  ) {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }

  ngOnInit(): void {
    this.user$ = this.userService.getCurrentUser().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du profil', error);
        // this.errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        return of(null); // Retourne `null` pour éviter de casser l’affichage
      })
    );
  }


  navigateCertificates(): void {
    this.router.navigate(['/certificates']);
  }
}
