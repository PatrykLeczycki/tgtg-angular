import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html'
})
export class ActivateAccountComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const registrationToken = this.route.snapshot.queryParamMap.get('token');
    this.authService.confirmAccount(userId, registrationToken).subscribe(
      response => {
        this.router.navigate(['/auth'], {
            queryParams: {
              confirmed: true
            }
          }
        );
      }, error => {
        this.router.navigate(['/auth'], {
            queryParams: {
              invalidConfirmationToken: true
            }
          }
        );
      }
    );
  }
}
