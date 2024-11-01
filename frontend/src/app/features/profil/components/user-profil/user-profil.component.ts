import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserProfil } from '../../models/userProfile.model';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrl: './user-profil.component.css'
})
export class UserProfilComponent implements OnInit{

  user?:UserProfil;

  emailConfirmResent = false;
  emailConfirmResentLoading = false;

  constructor(
    private userService: UserService, 
    private authService: AuthService
  ) {}

  // récupération de l'user connecté
  ngOnInit(): void { 
    this.userService.getUserProfil().subscribe({ 
      next: (userData: UserProfil) => {
        this.user = userData;  // Stocker les données reçues
      },
      error: (error: unknown) => {
        console.error('Erreur lors de la récupération du profil utilisateur', error);
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
}
