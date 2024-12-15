import { Component, Input } from '@angular/core';
import { UserProfil } from '../../models/userProfile.model';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {

  @Input() user?:UserProfil; 
}
