import { Country } from '@angular-material-extensions/select-country';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../profil/services/user.service';
import { FirstLoginService } from '../../services/first-login.service';
import { Router } from '@angular/router';
// import { FirstLoginUserUpdate2 } from '../../models/first-login-2.model';

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
    private userService: UserService,
    private firstLoginService: FirstLoginService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.loadUserAndInitForm();
  }

  /**
   * Charge les données de l'utilisateur depuis le backend et initialise le formulaire (pour obtenir le username généré par défaut)
   */
  private loadUserAndInitForm(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.isLoading = false;
        this.initForm(user);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur', error);
        this.isLoading = false;

        // Gérer les erreurs si nécessaire (redirection, message à l'utilisateur, etc.)
      },
    });
  }

  /**
   * Initialise le formulaire avec les données de l'utilisateur (username généré backend)
   * @param user Données utilisateur récupérées
   */
  private initForm(user: any): void {
    this.firstLoginForm2 = this.formBuilder.group({
      username: [
        user.username || 'diver#00000', // Utilise le username généré par le backend ou une valeur par défaut
        [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
      ],
      nationality: [
        user.nationality || null, // Nationalité existante ou valeur par défaut
      ],
    });
  }

  
  /**
   * Met à jour le champ 'nationality' lors de la sélection d'un pays
   * @param country Pays sélectionné ou null
   */
  onCountrySelected(country: Country | null) {
    this.firstLoginForm2.get('nationality')?.setValue(country?.alpha3Code ?? null); // On envoie le code en 3 lettre au backend
  }


  /**
   * Soumet le formulaire pour mettre à jour l'utilisateur
   */
  onSubmit(): void {
    if (this.firstLoginForm2.valid) {
      this.isLoading = true;

      const formData = this.firstLoginForm2.value;

      this.firstLoginService.updateUser(formData).subscribe({
        next: () => {
          console.log('User successfully updated');
          this.isLoading = false;

          // Redirection après la mise à jour
          this.router.navigate(['/dashboard']);
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
