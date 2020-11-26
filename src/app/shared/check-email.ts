import {FormGroup} from '@angular/forms';

export function checkEmail(form: FormGroup): boolean {
  const errors = form.get('email').errors;
  if (errors) {
    let invalid = false;
    Object.keys(errors).forEach(key => {
      if (key === 'email') {
        invalid = true;
      }
    });
    return invalid;
  }
  return false;
}
