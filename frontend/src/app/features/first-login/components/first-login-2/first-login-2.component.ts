import { Country } from '@angular-material-extensions/select-country';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../profil/services/user.service';
import { FirstLoginService } from '../../services/first-login.service';
import { Router } from '@angular/router';
import { ModalService } from '../../../../shared/services/utils/modal.service';
import { BannerSelectionComponent } from '../../../profil/components/banner-selection/banner-selection.component';
// import { FirstLoginUserUpdate2 } from '../../models/first-login-2.model';

@Component({
  selector: 'app-first-login-2',
  templateUrl: './first-login-2.component.html',
  styleUrl: './first-login-2.component.scss'
})
export class FirstLogin2Component {

  firstLoginForm2!: FormGroup;
  isLoading: boolean = true;
  userObtained:any;

  avatars: string[] = [
    'assets/images/default/avatars/profil-picture-default-1.png',
    'assets/images/default/avatars/profil-picture-default-2.png',
    'assets/images/default/avatars/profil-picture-default-3.png',
    'assets/images/default/avatars/profil-picture-default-4.png',
    'assets/images/default/avatars/profil-picture-default-5.png',
    'assets/images/default/avatars/profil-picture-default-6.png',
    'assets/images/default/avatars/profil-picture-default-7.png',
    'assets/images/default/avatars/profil-picture-default-8.png',
    'assets/images/default/avatars/profil-picture-default-9.png',
  ];
  selectedAvatar: string | null = null;

  banners: string[] = [
    'assets/images/default/banners/default-banner-0.webp',
    'assets/images/default/banners/default-banner-1.webp',
    'assets/images/default/banners/default-banner-2.webp',
    'assets/images/default/banners/default-banner-3.webp',
    'assets/images/default/banners/default-banner-4.webp',
    'assets/images/default/banners/default-banner-5.webp',
    'assets/images/default/banners/default-banner-6.webp',
    'assets/images/default/banners/default-banner-7.webp',
    'assets/images/default/banners/default-banner-8.webp',
    'assets/images/default/banners/default-banner-9.webp',
    'assets/images/default/banners/default-banner-10.webp',
    'assets/images/default/banners/default-banner-11.webp',
    'assets/images/default/banners/default-banner-12.webp',
    'assets/images/default/banners/default-banner-13.webp',
    'assets/images/default/banners/default-banner-14.webp',
    'assets/images/default/banners/default-banner-15.webp',
  ];
  selectedBanner: string | null = null;

  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService,
    private firstLoginService: FirstLoginService,
    private router: Router,
    private modalService: ModalService,
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
        this.userObtained = user;
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
    this.selectedAvatar = this.getRandomItem(this.avatars);
    this.selectedBanner = this.getRandomItem(this.banners);

    // Réorganise les listes pour placer l'élément sélectionné en premier
    this.avatars = this.moveItemToTop(this.avatars, this.selectedAvatar);
    this.banners = this.moveItemToTop(this.banners, this.selectedBanner);

    this.firstLoginForm2 = this.formBuilder.group({
      username: [
        user.username || 'diver#00000', // Utilise le username généré par le backend ou une valeur par défaut
        [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
      ],
      nationality: [
        user.nationality || null, // Nationalité existante ou valeur par défaut
      ],
      // avatar url (defaut ok car géré dans le backend => C'est ok si avatar "?", sinon il y en a un selected par defaut et ducoup doit pas etre null)
      avatar: [this.selectedAvatar], // pas de required ?
      banner: [this.selectedBanner], // pas de required ?
    });
  }

    /**
     * Sélectionne un élément aléatoire dans un tableau.
     * @param array Tableau d'éléments.
     * @returns Un élément aléatoire.
     */
    private getRandomItem(array: string[]): string {
      return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Déplace un élément spécifique au début d'un tableau.
     * @param array Tableau dans lequel déplacer l'élément.
     * @param item Élément à déplacer.
     */
    private moveItemToTop(array: string[], item: string): string[] {
      const index = array.indexOf(item);
      if (index > -1) {
        array.splice(index, 1); // Retire l'élément de sa position actuelle
        array.unshift(item); // Ajoute l'élément au début du tableau
      }
      return array;
    }


    openBannerSelectionModal() {
      this.modalService.open(BannerSelectionComponent, { banners: this.banners });
    }

  
  /**
   * Met à jour le champ 'nationality' lors de la sélection d'un pays
   * @param country Pays sélectionné ou null
   */
  onCountrySelected(country: Country | null) {
    this.firstLoginForm2.get('nationality')?.setValue(country?.alpha3Code ?? null); // On envoie le code en 3 lettre au backend
  }


  /**
   * Met à jour le path front default avatars lors de la selection d'un avatar
   * @param country Pays sélectionné ou null
   */
  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
    this.firstLoginForm2.get('avatar')?.setValue(avatar);
  }

  selectBanner(banner: string) {
    this.selectedBanner = banner;
    this.firstLoginForm2.get('banner')?.setValue(banner);
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
