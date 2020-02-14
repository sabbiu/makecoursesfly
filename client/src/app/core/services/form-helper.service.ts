import { AbstractControl } from '@angular/forms';

export class FormHelperService {
  isValid(property: AbstractControl) {
    return property.valid && (property.dirty || property.touched);
  }

  isInvalid(property: AbstractControl) {
    return property.invalid && (property.dirty || property.touched);
  }
}
