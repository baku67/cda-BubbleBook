import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { EmailCheckService } from '../../features/auth/services/email-disponibility.service';

export class EmailAsyncValidator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createValidator(emailCheckService: EmailCheckService, componentInstance: any) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        // Si le champ est vide, ne pas vérifier
        componentInstance.emailChecking = false;
        componentInstance.emailAvailable = null;
        return of(null);
      }

      componentInstance.emailChecking = true;
      componentInstance.emailAvailable = null;

      // fonction de check (service)
      return emailCheckService.checkEmailExists(control.value).pipe(
        tap(() => {
          componentInstance.emailChecking = true;
        }),
        map((response) => {
          componentInstance.emailAvailable = !response.exists;
          return response.exists ? { emailTaken: true } : null;
        }),
        catchError(() => {
          componentInstance.emailAvailable = null;
          return of(null);
        }),
        finalize(() => {
          componentInstance.emailChecking = false;
        })      );
    };
  }
}