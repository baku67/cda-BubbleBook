import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/utils/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-language-switch',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule],
  templateUrl: './language-switch.component.html',
  styleUrl: './language-switch.component.scss'
})
export class LanguageSwitchComponent implements OnInit {

  currentLang: string | undefined;

  constructor(public languageService: LanguageService) {};

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  switchLanguage(): void {
    this.languageService.switchLanguage();
  }
}
