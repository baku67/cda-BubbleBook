import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const password = formGroup.get('password')?.value;
  const passwordCheck = formGroup.get('passwordCheck')?.value;
  return password === passwordCheck ? null : { passwordMismatch: true };
};