import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ProfilService } from '../../services/profil.service';
import { Router } from '@angular/router';
import { FirstLoginUserUpdate1 } from '../../models/first-login-1.model';


@Component({
  selector: 'app-first-login-1',
  templateUrl: './first-login-1.component.html',
  styleUrl: './first-login-1.component.scss'
})
export class FirstLogin1Component implements OnInit {

  firstLoginForm!: FormGroup;
  isLoading: boolean;

  constructor(
    // private authService: AuthService,
    private formBuilder: FormBuilder, 
    private translateService: TranslateService,
    private profilService: ProfilService,
    private router: Router,
  ) {
    this.isLoading = false;
  }


  ngOnInit() {
    this.firstLoginForm = this.formBuilder.group({
      username: [
        'Dave', // défault random : #diver#4381 ? (username pas unique comme FESSBOUK)
         Validators.required
      ], 
    });
  }



  onSubmit(): void {
    if (this.firstLoginForm.valid) {
      this.isLoading = true;

      // Conversion explicite du formulaire en FirstLoginUserUpdate1
      const formData: FirstLoginUserUpdate1 = this.firstLoginForm.value;

      this.profilService.firstLoginForm(formData).subscribe({
        // redirection step 2 après UPDATE User
        next: (response) => {
          console.log('Mise à jour User réussie', response);
          this.isLoading = false;

          // Message de validation avant redirect
          //

          setTimeout(() => {
            this.router.navigate(['/first-login/step-two']);
          }, 1000)
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
