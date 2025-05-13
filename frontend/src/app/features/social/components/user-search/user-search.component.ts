import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';
import { UserSearchResults } from '../../models/user-search-results.model';
import { Observable, of } from 'rxjs';
import { COUNTRIES_DB } from '@angular-material-extensions/select-country';
import { UserProfil } from '../../../profil/models/userProfile.model';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {
  @Input() currentUser!: UserProfil | null;

  searchControl = new FormControl('');
  typeControl = new FormControl('all'); // Validator async update debouncing ?

  loading = false; 
  users: UserSearchResults[] = [];
  hasSearched = false;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        // Min 3 caractères + debouncing + différent:
        filter(query => typeof query === 'string' && query.trim().length >= 3),
        debounceTime(200),
        // distinctUntilChanged(), // fix retaper après suppression = HS
        switchMap((query) => this.triggerSearch(query)) 
      )
      .subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
          this.hasSearched = true;
        },
        error: () => {
          this.users = [];
          this.loading = false;
          this.hasSearched = true;
        }
      });
  
    this.typeControl.valueChanges.subscribe(() => {
      if (!this.hasSearched) {
        return;
      }
      this.triggerSearch(this.searchControl.value).subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
        },
        error: () => {
          this.users = [];
          this.loading = false;
        }
      });
    });
    // Vider les résultats et cacher le message liste vide quand on redescend en dessous de 3 char:
    this.searchControl.valueChanges.pipe(
      filter(query => typeof query === 'string' && query.trim().length < 3)
    ).subscribe(() => {
      this.users = [];
      this.hasSearched = false;
    });
  }
  
  // Fonction pour lancer la recherche 
  private triggerSearch(query: string | null): Observable<UserSearchResults[]> {
    const type = this.typeControl.value;
    if (!query || !query.trim()) {
      return of([]); // Retourne un Observable vide si la recherche est vide
    }
  
    this.loading = true;
    return this.searchService.search(type as 'divers' | 'clubs' | 'all', query as string)
      .pipe(
        catchError(() => {
          this.loading = false;
          return of([]); // Retourne un Observable vide en cas d'erreur
        }),
        map(users => this.updateCountryInfoForUsers(users)) // ✅ Ajoute les infos pays (pour flag)
      );
  }

  // lib Drapeaux des users results
  private updateCountryInfoForUsers(users: UserSearchResults[]): UserSearchResults[] {
    return users.map(user => {
      if (user.nationality) {
        const country = COUNTRIES_DB.find(c => c.alpha3Code === user.nationality);
        if (country) {
          return {
            ...user,
            countryName: country.name,
            flagSvgUrl: `assets/svg-country-flags/svg/${country.alpha2Code.toLowerCase()}.svg`
          };
        }
      }
      return {
        ...user,
        countryName: 'Inconnu',
        flagSvgUrl: `assets/images/default-flag.png`
      };
    });
  }
  
}
