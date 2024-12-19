import { Country } from '@angular-material-extensions/select-country';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../profil/services/user.service';
import { FirstLoginService } from '../../services/first-login.service';
import { Router } from '@angular/router';
import { FirstLoginUserUpdate2 } from '../../models/first-login-2.model';

@Component({
  selector: 'app-first-login-2',
  templateUrl: './first-login-2.component.html',
  styleUrl: './first-login-2.component.scss'
})
export class FirstLogin2Component {

  firstLoginForm2!: FormGroup;
  isLoading: boolean = true;

  constructor(
    private formBuilder: FormBuilder, 
    private translateService: TranslateService,
    private userService: UserService,
    private FirstLoginService: FirstLoginService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.isLoading = false;
        this.firstLoginForm2 = this.formBuilder.group({
          username: [
            user.username || 'diver#00000', // Par défaut (pas obligatoire car déjà généré en back)
            [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(30), // User entity column:length
            ]
          ], 
          nationality: [
            null, // Pas obligatoire
          ]
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur', error);
      }
    });
  }


  onCountrySelected(country: Country | null) {
    this.firstLoginForm2.get('nationality')?.setValue(country?.alpha3Code ?? null); // On envoie le code en 3 lettre au backend
  }

  onSubmit(): void {
    if (this.firstLoginForm2.valid) {
      this.isLoading = true;

      // Conversion explicite du formulaire en FirstLoginUserUpdate1
      const formData: FirstLoginUserUpdate2 = this.firstLoginForm2.value;

      this.FirstLoginService.firstLoginForm2(formData).subscribe({
        // redirection step 2 après UPDATE User
        next: (response) => {
          console.log('Mise à jour User réussie', response);
          this.isLoading = false;

          // Message de validation avant redirect
          //

          setTimeout(() => {
            this.router.navigate(['/user-profil']);
          }, 0);
          // }, 1000);
        },

        error: (error) => {
          console.error('There was an error during the request (register)', error);

          // Message d'erreur sur la page (pareil pour login etc...)

          this.isLoading = false;
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
