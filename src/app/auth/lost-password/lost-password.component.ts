import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {checkEmail} from '../../shared/check-email';

@Component({
  selector: 'app-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.css']
})
export class LostPasswordComponent implements OnInit {

  error: string;
  firstStage = true;
  emailSent = false;
  secondStage = false;
  userId: string;
  lostPasswordToken: string;
  invalidEmail = false;
  lostPasswordForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.emailSent = false;
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    this.lostPasswordToken = this.route.snapshot.queryParamMap.get('token');

    if (this.userId && this.lostPasswordToken) {
      this.firstStage = false;
      this.secondStage = true;
    }

    this.lostPasswordForm = this.formBuilder.group({
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        repeatPassword: ['']
      }, {validators: this.confirmPassword('password', 'repeatPassword')}
    );
  }

  onSubmit() {

    let authObservable;

    if (this.firstStage) {
      const email = this.lostPasswordForm.get('email').value;
      authObservable = this.authService.retrievePasswordFirstStage(email);
      authObservable.subscribe(responseData => {
        this.emailSent = true;
        this.router.navigate(['/retrievePassword']);
      }, error => {
        this.emailSent = true;
        console.log(error);
        this.error = error;
      });
    } else if (this.secondStage) {
      const password = this.lostPasswordForm.get('password').value;
      authObservable = this.authService.retrievePasswordSecondStage(password, this.userId, this.lostPasswordToken);
      authObservable.subscribe(responseData => {
        this.router.navigate(['/auth'], {
          queryParams: {
            passwordRetrieved: true
          }
        });
      }, error => {
        console.log(error);
        this.error = error;
        this.router.navigate(['/auth'], {
            queryParams: {
              invalidPassRecoveryToken: true
            }
          }
        );
      });
    }
  }

  onEmailCheck(): void {
    this.invalidEmail = checkEmail(this.lostPasswordForm);
  }

  confirmPassword(controlName: string, matchingControlName: string): (formGroup: FormGroup) => void {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (!this.firstStage && control.value !== matchingControl.value) {
        matchingControl.setErrors({mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
