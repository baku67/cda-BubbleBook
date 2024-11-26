import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ProfilService } from '../../services/profil.service';


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
  ) {
    this.isLoading = false;
  }


  ngOnInit() {
    this.firstLoginForm = this.formBuilder.group({
      username: [
        '#diver#4381', // défault random pas pris #diver#4381
         Validators.required
      ], 
    });
  }



  onSubmit(): void {
    if (this.firstLoginForm.valid) {
      this.isLoading = true;

      this.profilService.firstLoginForm(this.firstLoginForm.value).subscribe({
        // next: () => {
        //   console.log('Username de l\'utilisateur: ....');
        //   this.profilService.autoLoginAfterRegister(
        //     this.profilService.get('email')?.value,
        //     this.profilService.get('password')?.value
        //   );
        // },
        error: (error) => {
          console.error('There was an error during the request (register)', error);
          this.isLoading = false;
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }










}
