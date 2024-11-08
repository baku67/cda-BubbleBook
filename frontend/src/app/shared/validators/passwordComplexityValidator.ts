import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordComplexityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const errors: Record<string, string> = {};

    // Vérifie chaque critère et ajoute une erreur correspondante si le critère n'est pas respecté
    if (!/[A-Z]/.test(value)) {
      errors['uppercase'] = 'une lettre majuscule';
    }

    if (!/[a-z]/.test(value)) {
      errors['lowercase'] = 'une lettre minuscule';
    }

    if (!/[0-9]/.test(value)) {
      errors['digit'] = 'un chiffre';
    }

    if (!/[@$!%*?&]/.test(value)) {
      errors['special'] = 'un caractère spécial (@$!%*?&)';
    }

    return Object.keys(errors).length > 0 ? { passwordComplexity: errors } : null;
  };
}
