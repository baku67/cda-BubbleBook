import { Component, Input, OnInit } from '@angular/core';
import { UserProfil } from '../../models/userProfile.model';
import { Country, COUNTRIES_DB } from '@angular-material-extensions/select-country';
import { Router } from '@angular/router';
import { OtherUserProfil } from '../../../social/models/other-user-profil.model';
import { filter, Observable, startWith, Subscription } from 'rxjs';


@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent implements OnInit {

  @Input() user$!: Observable<UserProfil | OtherUserProfil | null>; 
  user?: UserProfil | OtherUserProfil | null = null; // Stocke la valeur extraite de l'Observable
  
  private subscription?: Subscription;

  country: Country | undefined;
  flagSvgUrl?: string; 

  constructor(private router: Router) {}

  ngOnInit() {
    this.subscription = this.user$.pipe(
      startWith(null) // ✅ Permet d'éviter les problèmes de non-initialisation
    ).subscribe(user => {
      this.user = user;
      console.log("this.user de user-card", this.user);
      if (user) { // ✅ Vérification avant d'appeler `updateCountryInfo()`
        this.updateCountryInfo();
      }
    });
  }

  ngOnDestroy() {
    // Évite les fuites mémoire en se désabonnant
    this.subscription?.unsubscribe();
  }

  isCurrentUserProfil(): boolean {
    return (this.user as UserProfil).email !== undefined;
  }

  // // PK ça marche sans ça ?
  navigateToUserProfile(): void {
    if (this.isCurrentUserProfil()) {
      this.router.navigate(['/account-settings']);
    }
  }

  private updateCountryInfo() {
    if (this.user?.nationality) {
      const code = this.user.nationality;
      this.country = COUNTRIES_DB.find(c => c.alpha3Code === code);
      const alpha2 = this.country?.alpha2Code.toLowerCase();
      this.flagSvgUrl = `assets/svg-country-flags/svg/${alpha2}.svg`;
    } else {
      this.flagSvgUrl = `assets/images/default-flag.png`;
    }
  }
}
