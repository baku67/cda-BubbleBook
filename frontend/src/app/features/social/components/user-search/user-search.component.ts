import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';
import { OtherUserProfil } from '../../models/OtherUserProfil';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {
  searchControl = new FormControl('');
  users: OtherUserProfil[] = [];
  loading = false;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),  // Attendre 300ms après la dernière frappe
        distinctUntilChanged(), // Éviter les appels avec la même valeur consécutive
        switchMap((query) => {
          if (!query || !query.trim()) {
            this.users = [];
            return [];
          }
          this.loading = true;
          return this.searchService.searchUsers(query as string);
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
