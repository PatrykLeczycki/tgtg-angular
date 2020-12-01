import {DatePipe, DecimalPipe} from '@angular/common';
import {Component, QueryList, ViewChildren} from '@angular/core';
import {Observable} from 'rxjs';

import {ReviewDatatableService} from './review-datatable.service';
import {NgbdSortableHeader, SortEvent} from './review-sortable.directive';
import {ReviewInterface} from '../../model/review-interface';

@Component({
  selector: 'app-review-table',
  templateUrl: './review-table.html',
  styleUrls: ['./review-table.css'],
  providers: [ReviewDatatableService, DecimalPipe]
})
export class ReviewTableComponent {
  reviews$: Observable<ReviewInterface[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: ReviewDatatableService,
              private datePipe: DatePipe) {
    this.reviews$ = service.reviews$;
    this.total$ = service.total$;
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  transformDate(date: Date): string {
    return this.datePipe.transform(date, 'HH:mm dd.MM.yyyy');
  }
}
