import { Component } from '@angular/core';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [PageHeaderComponent, TranslateModule],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss'
})
export class NotFoundPageComponent {

}
