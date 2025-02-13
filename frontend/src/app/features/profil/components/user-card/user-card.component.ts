import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UserProfil } from '../../models/userProfile.model';
import { Country, COUNTRIES_DB } from '@angular-material-extensions/select-country';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent implements OnInit {

  constructor(private router: Router) {}

  @Input() user?:UserProfil; 
  
  country: Country | undefined;
  flagSvgUrl?: string; 

  ngOnInit() { 
    console.log(this.user),
    this.updateCountryInfo();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user'].currentValue) {
      this.updateCountryInfo();
    }
  }

  navigateToUserProfile(): void {
    this.router.navigate(['/account-settings']);
  }

  private updateCountryInfo() {
    if (this.user?.nationality) {
      const code = this.user.nationality;
      this.country = COUNTRIES_DB.find(c => c.alpha3Code === code);

      if (this.country) {
        console.log(this.country.name);
        const alpha2 = this.country.alpha2Code.toLowerCase();
        this.flagSvgUrl = `assets/svg-country-flags/svg/${alpha2}.svg`;
      } else {
        console.warn('Pays introuvable pour le code', code);
      }
    } else {
      this.flagSvgUrl = `assets/images/default-flag.png`;
    }
  }
}
