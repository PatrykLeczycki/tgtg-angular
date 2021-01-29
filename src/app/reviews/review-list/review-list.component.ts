import {Component} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router} from "@angular/router";

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent {

  error: string;

  constructor(private datePipe: DatePipe,
              private router: Router) {
    if (this.router.getCurrentNavigation()
      && this.router.getCurrentNavigation().extras.state
      && this.router.getCurrentNavigation().extras.state.error === 'Nie znaleziono podanej recenzji') {
      this.error = this.router.getCurrentNavigation().extras.state.error;
    }
  }

  transformDate(date: Date): string {
    return this.datePipe.transform(date, 'HH:mm dd.MM.yyyy');
  }
}
