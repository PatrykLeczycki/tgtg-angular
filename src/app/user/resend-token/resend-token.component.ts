import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {checkEmail} from '../../shared/check-email';

@Component({
  selector: 'app-resend-token',
  templateUrl: './resend-token.component.html',
  styleUrls: ['./resend-token.component.css']
})
export class ResendTokenComponent implements OnInit {

  resendTokenForm: FormGroup;
  emailSent = false;
  invalidEmail = false;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.emailSent = false;

    this.resendTokenForm = this.formBuilder.group({
        email: ['', [Validators.email, Validators.required]]
      }
    );
  }

  onSubmit() {
    const email = this.resendTokenForm.get('email').value;
    const authObservable = this.authService.resendConfirmationToken(email);
    authObservable.subscribe(responseData => {
      this.emailSent = true;
    }, error => {
      this.emailSent = true;
    });
  }

  onEmailCheck(): void {
    this.invalidEmail = checkEmail(this.resendTokenForm);
    // const errors = this.resendTokenForm.get('email').errors;
    // if (errors) {
    //   let invalid = false;
    //   Object.keys(errors).forEach(key => {
    //     if (key === 'email') {
    //       invalid = true;
    //     }
    //   });
    //   this.invalidEmail = invalid;
    // } else {
    //   this.invalidEmail = false;
    // }
  }
}
