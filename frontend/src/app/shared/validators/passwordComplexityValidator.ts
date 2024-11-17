import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordComplexityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    let complexityScore = 0;

    //***** */ Vérifie chaque critère et augmente le score de complexité

    // 1 majuscule:
    if (/[A-Z]/.test(value)) {
      complexityScore++;
    }
    // 1 minuscule:
    if (/[a-z]/.test(value)) {
      complexityScore++;
    }
    // 1 chiffre
    if (/[0-9]/.test(value)) {
      complexityScore++;
    }
    // 1 specialChar
    if (/[@$!%*?&]/.test(value)) {
      complexityScore++;
    }

    // Ajoute des points supplémentaires pour la longueur du mot de passe
    if (value.length >= 10) {
      complexityScore++;
    }
    if (value.length >= 12) {
      complexityScore++;
    }

    // Retourner le score de complexité
    return { passwordComplexityScore: complexityScore };
  };
}