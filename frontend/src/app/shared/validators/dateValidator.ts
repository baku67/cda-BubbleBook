import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class DateValidator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static pastDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = control.value;
      const today = new Date();
      if (selectedDate && new Date(selectedDate) >= today) {
        return { futureDate: true }; // Erreur si la date est dans le futur
      }
      return null; // Pas d'erreur
    };
  }
}
