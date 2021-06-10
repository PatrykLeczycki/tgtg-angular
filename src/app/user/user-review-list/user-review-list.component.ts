import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ReviewService} from '../../reviews/review/review.service';
import {Observable} from 'rxjs';
import {ReviewInterface} from '../../model/review-interface';
import {DatePipe} from '@angular/common';
import {NgbdSortableHeader, SortEvent} from '../../reviews/review-sort/review-sortable.directive';
import {UserReviewDatatableService} from './user-review-datatable.service';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-user-review-list',
  templateUrl: './user-review-list.component.html',
  styleUrls: ['./user-review-list.component.css'],
  providers: [UserReviewDatatableService]
})
export class UserReviewListComponent implements OnInit {

  userReviews$: Observable<ReviewInterface[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  reviewDeleted: boolean;

  constructor(private reviewService: ReviewService,
              public datatableService: UserReviewDatatableService,
              private authService: AuthService,
              private datePipe: DatePipe) {
    this.userReviews$ = datatableService.reviews$;
    this.total$ = datatableService.total$;
  }

  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.datatableService.sortColumn = column;
    this.datatableService.sortDirection = direction;
  }

  transformDate(date: Date): string {
    return this.datePipe.transform(date, 'HH:mm dd.MM.yyyy');
  }

  onDelete(reviewId: number) {
    if (confirm("Czy na pewno chcesz usunąć wskazaną recenzję?")) {
      const userId = this.authService.user.value.id;

      this.reviewService.delete(reviewId, userId).subscribe(response => {
        this.reviewDeleted = true;
        this.datatableService.updateReviewInterfaces();
      });
    }
  }

  ngOnInit(): void {
    this.reviewDeleted = false;
  }
}
