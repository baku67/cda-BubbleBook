import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';
import { OtherUserProfil } from '../../models/OtherUserProfil';
import { UserSearchResults } from '../../models/UserSearchResults';

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
        switchMap((query) => {
          const type = this.typeControl.value; // Récupération du type d'entité sélectionné
          if (!query || !query.trim()) {
            this.users = [];
            return [];
          }
          this.loading = true;
          return this.searchService.search(type as 'divers' | 'clubs' | 'all', query as string);
        })
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
  }
}
