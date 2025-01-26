import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserProfil } from '../../models/userProfile.model';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

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

  constructor(
    private userService: UserService, 
    private authService: AuthService,
    private router: Router,
  ) {}

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
