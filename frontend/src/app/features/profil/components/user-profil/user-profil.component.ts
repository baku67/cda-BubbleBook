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

  // récupération de l'user connecté
  ngOnInit(): void { 
    this.userService.getCurrentUser().subscribe({ 
      next: (userData: UserProfil) => {
        this.user = userData;  // Stocker les données reçues
        this.isUserLoading = false;
      },
      error: (error: unknown) => {
        console.error('Erreur lors de la récupération du profil utilisateur', error);
        this.isUserLoading = false;
      }
    });
  }

  
  resendConfirmationEmail(): void {
    if(!this.user?.isVerified) {

      this.emailConfirmResentLoading = true;
      
      this.authService.resendConfirmationEmail(this.user!.email).subscribe(
        response => {
          console.log('Email de confirmation renvoyé:', response);
          this.emailConfirmResentLoading = false;
          this.emailConfirmResent = true;
        },
        error => {
          console.error('Erreur lors de la régénération du token:', error);
          this.emailConfirmResentLoading = false;
          alert('Impossible d\'envoyer l\'email de confirmation. Veuillez réessayer plus tard.');
        }
      );
    }
  }

  navigateCertificates(): void {
    this.router.navigate(['/certificates']);
  }
}
