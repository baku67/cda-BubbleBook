import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

// TODO: désactiver click et hover sur option séléctionnée

@Component({
  selector: 'app-choice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './choice.component.html',
  styleUrl: './choice.component.scss'
})
export class ChoiceComponent<T = any> {
  /**
   * @param string 'radio' ou 'cubic-inline'
   */
  @Input() style:string = "cubic-inline"; 
  /**
   * @param {label: string; value: T}
   */
  @Input() choices: { label: string; value: T }[] = [];
  @Input() selectedChoice?: T;
  /**
   * @param boolean a default false puis true pendant la requete parent, puis next(true)
   */
  @Input() isRequestSending: boolean = false;
  @Output() choiceChange = new EventEmitter<T>();

  translatedChoices: { label: string; value: T }[] = [];

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translateService.get(this.choices.map(choice => choice.label)).subscribe(translations => {
      this.translatedChoices = this.choices.map(choice => ({
        label: translations[choice.label] || choice.label, // Utilise la traduction si disponible
        value: choice.value
      }));
    });
    this.translateService.onLangChange.subscribe(() => this.ngOnInit());
  }


  // Radio:
  onChoiceChange(choice: T): void {
    this.choiceChange.emit(choice);
  }

  // Cubic-inline
  selectChoice(choice: T): void {
    if (this.selectedChoice !== choice) {
      this.selectedChoice = choice;
      this.choiceChange.emit(choice);
    }
  }
}
