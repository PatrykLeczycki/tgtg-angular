import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {AuthService} from './auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {checkEmail} from '../shared/check-email';

@Component({
  selector: 'app-authentication',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  error: string = null;
  isLoginMode = true;
  redirectUrl = '';
  registered = false;
  changedPassword = false;
  accountConfirmed = false;
  passwordRetrieved = false;
  invalidConfirmationToken = false;
  invalidPassRecoveryToken = false;
  invalidEmail = false;

  private userSub: Subscription;

  authForm: FormGroup;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl');
    this.passwordRetrieved = this.route.snapshot.queryParamMap.get('passwordRetrieved') === 'true';
    this.accountConfirmed = this.route.snapshot.queryParamMap.get('confirmed') === 'true';
    this.changedPassword = this.route.snapshot.queryParamMap.get('changedPassword') === 'true';
    this.invalidConfirmationToken = this.route.snapshot.queryParamMap.get('invalidConfirmationToken') === 'true';
    this.invalidPassRecoveryToken = this.route.snapshot.queryParamMap.get('invalidPassRecoveryToken') === 'true';

    this.userSub = this.authService.user.subscribe(user => {
      if (!!user) {
        this.router.navigate(['/reviews']);
      }
    });

    this.authForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['']
    }, {validators: this.confirmPassword('password', 'repeatPassword')});
  }

  onSubmit(): void {
    this.registered = false;
    this.accountConfirmed = false;
    this.passwordRetrieved = false;
    this.changedPassword = false;
    this.invalidConfirmationToken = false;
    this.invalidPassRecoveryToken = false;
    const email = this.authForm.get('email').value;
    const password = this.authForm.get('password').value;
    let authObservable: Observable<{ email: string, password: string }>;

    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
      authObservable.subscribe(responseData => {
        this.router.navigate(['/' + this.redirectUrl]);
      }, error => {
        console.log(error);
        this.error = error;
      });
    } else {
      authObservable = this.authService.signup(email, password);
      authObservable.subscribe(responseData => {
        this.registered = true;
        this.isLoginMode = true;
      }, error => {
        console.log(error);
        this.error = error;
      });
    }
    this.authForm.patchValue({
      password: '',
      repeatPassword: ''
    });
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
    this.registered = false;
    this.changedPassword = false;
    this.accountConfirmed = false;
    this.passwordRetrieved = false;
    this.invalidConfirmationToken = false;
    this.invalidPassRecoveryToken = false;
  }

  confirmPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (!(control.errors && control.errors.minLength) && matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (!this.isLoginMode && control.value !== matchingControl.value) {
        matchingControl.setErrors({mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  ngOnDestroy(): void {
  }

  onEmailCheck(): void {
    this.invalidEmail = checkEmail(this.authForm);
  }

  resendConfirmationLink(): void {
    this.router.navigate(['/resendToken'], {
      queryParams: {
        confirmationLink: true
      }
    });
  }
}
