import { FormControl } from '@angular/forms';

export class FormHelperService {
  isValid(property: FormControl) {
    return property.valid && (property.dirty || property.touched);
  }

  isInvalid(property: FormControl) {
    return property.invalid && (property.dirty || property.touched);
  }
}
