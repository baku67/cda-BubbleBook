import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent 
{
  @Input() title!: string;
  @Input() colorTheme: boolean = true;
  @Input() paragraph?: string | null;
  @Input() matIcon!: string | null;

}
