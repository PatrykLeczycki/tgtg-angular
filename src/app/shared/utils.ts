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

export function getApiUrl(): string {
  return 'http://localhost:8080';
}

// export function getApiUrl(): string {
//   return 'http://pleczycki.pl/tgtg-spring';
// }
