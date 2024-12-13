import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FirstLoginService } from '../../services/first-login.service';
import { Router } from '@angular/router';
import { FirstLoginUserUpdate1 } from '../../models/first-login-1.model';
import { UserService } from '../../../profil/services/user.service';


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
    private userService: UserService,
    private FirstLoginService: FirstLoginService,
    private router: Router,
  ) {
    this.isLoading = false;
  }


  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.firstLoginForm = this.formBuilder.group({
          username: [
            user.username || 'diver#00000', // Par défaut
            [
              Validators.required,
              Validators.minLength(3)
            ]
          ], 
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur', error);
      }
    });
  }



  onSubmit(): void {
    if (this.firstLoginForm.valid) {
      this.isLoading = true;

      // Conversion explicite du formulaire en FirstLoginUserUpdate1
      const formData: FirstLoginUserUpdate1 = this.firstLoginForm.value;

      this.FirstLoginService.firstLoginForm(formData).subscribe({
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
