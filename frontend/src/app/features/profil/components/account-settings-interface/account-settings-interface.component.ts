import { Component, Input, OnInit, signal } from '@angular/core';
import { UserProfil } from '../../models/userProfile.model';
import { Observable } from 'rxjs';
import { ThemeType } from '../../../../shared/models/ThemeType.model';
import { ThemeService } from '../../../../shared/services/utils/theme.service';
import { CustomizationService } from '../../../../shared/services/utils/customization.service';
import { ThemePrimaryColorService } from '../../../../shared/services/utils/theme-primary-color.service';
import { LanguageService } from '../../../../shared/services/utils/language.service';

@Component({
  selector: 'app-account-settings-interface',
  templateUrl: './account-settings-interface.component.html',
  styleUrl: './account-settings-interface.component.scss'
})
export class AccountSettingsInterfaceComponent implements OnInit {

    @Input() user!: UserProfil;

    currentTheme$: Observable<ThemeType>;
    displayFish$!: Observable<boolean>;
    isBgVideo$!: Observable<boolean>;

    currentLang!: string;

    DTprimaryColors : string[] = ['#3ec0ec', '#ff6b6b', '#f9c74f', '#2cedd6', '#4ff98c', '#f4a261'];
    selectedDTprimaryColor: string = '#3ec0ec'; // Valeur par défaut pour themePrimaryColor
    
    readonly panelOpenState = signal(false);

    constructor(
      private themeService: ThemeService,
      private customizationService: CustomizationService,
      private themePrimaryColorService: ThemePrimaryColorService,
      public languageService: LanguageService
    ) {
      this.currentTheme$ = this.themeService.currentTheme$;
      this.displayFish$ = this.customizationService.displayFishState$;
      this.isBgVideo$ = this.customizationService.isBgVideoState$;
    }

    ngOnInit(): void {
      this.selectedDTprimaryColor = this.themePrimaryColorService.getStoredColor();
      this.languageService.currentLang$.subscribe((lang) => {
        this.currentLang = lang;
      });
    }

    toggleFishDisplay(): void {
      this.customizationService.toggleDisplayFish();
    }
    
    toggleBgVideo(): void {
      this.customizationService.toggleBgVideo();
    }

    changePrimaryColor(color: string): void {
      if (!color) return;
      this.selectedDTprimaryColor = color;
      this.themePrimaryColorService.setPrimaryColor(color);
    }

    public switchLanguage(lang: string): void {
      this.languageService.setLanguage(lang);
    }
    public switchTheme(theme: ThemeType): void {
      this.themeService.setTheme(theme);
    }
}
