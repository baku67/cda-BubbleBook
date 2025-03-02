import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UserProfil } from '../../models/userProfile.model';
import { Country, COUNTRIES_DB } from '@angular-material-extensions/select-country';
import { Router } from '@angular/router';
import { OtherUserProfil } from '../../../social/models/OtherUserProfil';


@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent implements OnInit {

  constructor(private router: Router) {}

  @Input() user?:UserProfil | OtherUserProfil; 
  
  country: Country | undefined;
  flagSvgUrl?: string; 

  ngOnInit() { 
    this.updateCountryInfo();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user'].currentValue) {
      this.updateCountryInfo();
    }
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
