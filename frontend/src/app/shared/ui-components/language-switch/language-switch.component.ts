import { Component } from '@angular/core';
import { LanguageService } from '../../services/utils/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-language-switch',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule],
  templateUrl: './language-switch.component.html',
  styleUrl: './language-switch.component.css'
})
export class LanguageSwitchComponent {

  constructor(public languageService: LanguageService) {};

  switchLanguage(): void {
    this.languageService.switchLanguage();
  }
}
