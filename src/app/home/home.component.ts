import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReviewService} from '../reviews/review/review.service';
import {Review} from '../model/review.model';
import {DatePipe} from '@angular/common';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  latestReviewsLimit = 10;
  latestReviews: Review[] = [];
  isAuthenticated = false;

  private userSub: Subscription;

  constructor(private reviewService: ReviewService,
              private datePipe: DatePipe,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
    this.reviewService.getLatest(this.latestReviewsLimit)
      .subscribe(resData => {
        this.latestReviews = resData;
      });
  }

  transformDate(date: Date): string {
    return this.datePipe.transform(date, 'HH:mm dd.MM.yyyy');
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
