import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  error: string;
  changePasswordForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        repeatNewPassword: ['']
      }, {validators: this.confirmPassword('newPassword', 'repeatNewPassword')}
    );
  }

  onSubmit() {

    const currentPassword = this.changePasswordForm.get('currentPassword').value;
    const newPassword = this.changePasswordForm.get('newPassword').value;
    const userId = this.authService.user.value.id;

    this.authService.changePassword(currentPassword, newPassword, userId)
      .subscribe(responseData => {
        this.authService.logout(true);
      }, error => {
        this.error = error;
        console.log(error);
      });
  }

  confirmPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
