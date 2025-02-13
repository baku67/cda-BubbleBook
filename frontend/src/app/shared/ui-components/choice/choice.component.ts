import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

// TODO: désactiver click et hover sur option séléctionnée

@Component({
  selector: 'app-choice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './choice.component.html',
  styleUrl: './choice.component.scss'
})
export class ChoiceComponent<T = any> {
  @Input() style:string = "cubic-inline"; // 'radio' ou 'cubic-inline'
  @Input() choices: { value: T }[] = [];
  @Input() selectedChoice?: T;
  @Output() choiceChange = new EventEmitter<T>();

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
