import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FirstLoginService } from '../../services/first-login.service';
import { Router } from '@angular/router';
// import { FirstLoginUserUpdate1 } from '../../models/first-login-1.model';
import { UserService } from '../../../profil/services/user.service';


@Component({
  selector: 'app-first-login-1',
  templateUrl: './first-login-1.component.html',
  styleUrl: './first-login-1.component.scss'
})
export class FirstLogin1Component implements OnInit {

  firstLoginForm!: FormGroup;
  private allowedAccountTypes = ['option-diver', 'option-club'];
  isLoading: boolean;

  constructor(
    private formBuilder: FormBuilder, 
    private translateService: TranslateService,
    private userService: UserService,
    private firstLoginService: FirstLoginService,
    private router: Router,
  ) {
    this.isLoading = false;
  }

// OLD
  // ngOnInit() {
  //   this.userService.getCurrentUser().subscribe({
  //     next: (user) => {
  //       this.firstLoginForm = this.formBuilder.group({
  //         accountType: 
  //         [
  //           'option-diver', // values: "option-diver" / "option-club"
  //           [Validators.required, Validators.pattern(/^(option-diver|option-club)$/)]
  //         ]
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Erreur lors de la récupération de l\'utilisateur', error);
  //     }
  //   });
  // }

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
