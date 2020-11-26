import { Component, OnInit } from '@angular/core';
import {Review} from '../../model/review.model';
import {Subscription} from 'rxjs';
import {ReviewService} from '../review/review.service';
import {DatePipe} from '@angular/common';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-latest-reviews-list',
  templateUrl: './latest-reviews-list.component.html',
  styleUrls: ['./latest-reviews-list.component.css']
})
export class LatestReviewsListComponent implements OnInit {
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
