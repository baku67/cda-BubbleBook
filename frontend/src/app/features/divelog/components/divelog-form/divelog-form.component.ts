import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../../shared/services/utils/modal.service';
import { DivelogService } from '../../services/divelog.service';
import { DIVELOG_THEMES, DivelogThemeOption } from '../../models/divelog-theme';


@Component({
  selector: 'app-divelog-form',
  templateUrl: './divelog-form.component.html',
  styleUrl: './divelog-form.component.scss'
})
export class DivelogFormComponent {

  addDivelogForm!: FormGroup;
  currentYear: number = new Date().getFullYear();

  themes: DivelogThemeOption[] = DIVELOG_THEMES;

  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder, 
    private modalService: ModalService,
    private divelogService: DivelogService,
  ) {}

  ngOnInit() {
    this.themes = this._shuffleArray(DIVELOG_THEMES); // Mélange a chaque ouverture de modal Form
    this.addDivelogForm = this.formBuilder.group({
      title: ['', [Validators.required]], 
      description: [''], 
      theme: [this.themes[0].id]
    });
  }

  selectTheme(id: string): void {
    this.addDivelogForm.get('theme')!.setValue(id);
  }

  onSubmit(): void {
    if (this.addDivelogForm.valid) {
      this.isLoading = true;

      this.divelogService.addDivelogToUser(this.addDivelogForm.value).subscribe({
        next: (createdDivelog) => {
          this.modalService.close(createdDivelog); // Passe l'objet créé au parent
        },
        error: (error:any) => {
          console.error('There was an error during the request (addDivelogToUser)', error);
          this.errorMessage = 'There was an error adding a divelog. Try again later';
          this.isLoading = false;
        }
      });
    } else {
      console.error('Form is invalid');
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  private _shuffleArray<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
