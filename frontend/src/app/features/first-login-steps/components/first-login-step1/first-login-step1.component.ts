import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirstLoginStepsService } from '../../services/first-login-steps.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-first-login-step1',
  templateUrl: './first-login-step1.component.html',
  styleUrl: './first-login-step1.component.scss'
})
export class FirstLoginStep1Component implements OnInit {

  firstLoginForm!: FormGroup;
  isLoading: boolean;

  constructor(
    private formBuilder: FormBuilder, 
    private firstLoginService: FirstLoginStepsService,
    private router: Router,
  ) {
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialise le formulaire
   */
  private initForm(): void {
    this.firstLoginForm = this.formBuilder.group({
      accountType: [
        'option-diver', // Valeur par défaut
        [Validators.required, Validators.pattern(/^(option-diver|option-club)$/)],
      ],
    });
  }

  /**
   * Définit une valeur pour le champ accountType
   * @param value Nouvelle valeur de accountType
   */
  setAccountTypeValue(value: string): void {
    this.firstLoginForm.get('accountType')?.setValue(value);
  }

  /**
   * Soumet le formulaire pour mettre à jour l'utilisateur
   */
  onSubmit(): void {
    if (this.firstLoginForm.valid) {
      this.isLoading = true;

      // Données à envoyer au backend
      const formData = this.firstLoginForm.value;

      this.firstLoginService.updateUser(formData).subscribe({
        next: () => {
          console.log('User successfully updated');
          this.isLoading = false;

          // Redirection vers la seconde étape
          this.router.navigate(['/first-login/step-two']);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.isLoading = false;

          // Ajouter des messages d'erreur si nécessaire
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }

}
