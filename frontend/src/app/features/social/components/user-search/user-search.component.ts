import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';
import { OtherUserProfil } from '../../models/OtherUserProfil';
import { UserSearchResults } from '../../models/UserSearchResults';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {
  searchControl = new FormControl('');
  typeControl = new FormControl('all'); // Validator async update debouncing ?
  users: UserSearchResults[] = [];
  loading = false;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.triggerSearch(query)) 
      )
      .subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
        },
        error: () => {
          this.users = [];
          this.loading = false;
        }
      });
  
    this.typeControl.valueChanges.subscribe(() => {
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
        })
      );
  }
}
