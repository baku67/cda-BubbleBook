import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirstLoginStepsService } from '../../services/first-login-steps.service';
import { Router } from '@angular/router';
import { AnimationService } from '../../../../shared/services/utils/animation.service';


@Component({
  selector: 'app-first-login-step1',
  templateUrl: './first-login-step1.component.html',
  styleUrl: './first-login-step1.component.scss'
})
export class FirstLoginStep1Component implements OnInit {

  firstLoginForm!: FormGroup;
  isLoading: boolean;

  isAnimatingFadeOut = false;

  constructor(
    private formBuilder: FormBuilder, 
    private firstLoginService: FirstLoginStepsService,
    private router: Router,
    private animationService: AnimationService,
  ) {
    this.isLoading = false;
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
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

      const formData = this.firstLoginForm.value;
      this.firstLoginService.updateUser(formData).subscribe({
        next: () => {
          console.log('User successfully updated');
          // this.isLoading = false; // désactivé car enchaine avec un loading fatchdata de la route suivante (dailleurs plutot resolver ça?)

          this.router.navigate(['/first-login/step-two']);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.isLoading = false;
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }

}
