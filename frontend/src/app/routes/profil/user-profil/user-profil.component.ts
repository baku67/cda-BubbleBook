import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/auth/user.service';
import { UserProfil } from '../../../models/user/userProfile.model';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrl: './user-profil.component.css'
})
export class UserProfilComponent implements OnInit{

  user?:UserProfil;

  constructor(private userService: UserService) {}

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
}
