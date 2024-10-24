import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EmailCheckService } from '../../features/auth/services/email-disponibility.service';

export class EmailAsyncValidator {
  static createValidator(emailCheckService: EmailCheckService) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        // Si le champ est vide, ne pas vérifier
        return of(null);
      }

      // fonction de check (service)
      return emailCheckService.checkEmailExists(control.value).pipe(
        map((response) => {
          return response.exists ? { emailTaken: true } : null;
        }),
        catchError(() => of(null)) // Si une erreur survient, ne pas bloquer la validation
      );
    };
  }
}