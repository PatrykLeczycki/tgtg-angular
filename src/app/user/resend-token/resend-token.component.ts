import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {checkEmail} from '../../shared/utils';

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
  }
}
