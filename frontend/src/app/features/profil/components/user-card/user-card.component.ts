import { Component, Input, OnInit } from '@angular/core';
import { UserProfil } from '../../models/userProfile.model';
import { Country, COUNTRIES_DB } from '@angular-material-extensions/select-country';


@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent implements OnInit {

  @Input() user?:UserProfil; 
  country: Country | undefined;
  flagSvgUrl?: string; 

  ngOnInit() {  
    if (this.user?.nationality) {
      const code = this.user.nationality;
      this.country = COUNTRIES_DB.find(c => c.alpha3Code === code);

      if (this.country) {
        console.log(this.country.name);
        // Les SVG sont sous form alpha2.svg (en lowercase, et alpha2 = 2 lettres)
        const alpha2 = this.country.alpha2Code.toLowerCase();
        this.flagSvgUrl = `assets/svg-country-flags/svg/${alpha2}.svg`; // dans ng_module/svg-country-flags
      } else {
        console.warn('Pays introuvable pour le code', code);
      }
    }
    else {
      this.flagSvgUrl = `assets/images/default-flag.png`; // dans ng_module/svg-country-flags
    }
  }
}
