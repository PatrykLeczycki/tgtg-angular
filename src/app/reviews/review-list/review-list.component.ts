import {Component, OnInit} from '@angular/core';
import {Review} from '../../model/review.model';
import {ReviewService} from '../review/review.service';
import {DatePipe} from '@angular/common';
import {ReviewDatatableService} from '../review-sort/review-datatable.service';
import {ReviewInterface} from '../../model/review-interface';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {

  // reviews: Review[] = [];
  background = 'transparent';

  constructor(private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    // this.reviewService.getAll()
    //   .subscribe(response => {
    //     this.reviews = response;
    //   });
  }

  transformDate(date: Date): string {
    return this.datePipe.transform(date, 'HH:mm dd.MM.yyyy');
  }
}
