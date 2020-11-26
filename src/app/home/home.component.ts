import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ReviewService} from '../reviews/review/review.service';
import {Review} from '../model/review.model';
import {DatePipe} from '@angular/common';
import {MdbTableDirective, MdbTablePaginationComponent} from 'angular-bootstrap-md';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';

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
              private authService: AuthService,
              private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
    this.reviewService.getLatest(this.latestReviewsLimit)
      .subscribe(resData => {
        this.latestReviews = resData;
      });

    this.httpClient.get('http://pleczycki.pl/tgtg-spring/files')
      .subscribe(res => {

      });
  }

  transformDate(date: Date): string {
    return this.datePipe.transform(date, 'HH:mm dd.MM.yyyy');
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
