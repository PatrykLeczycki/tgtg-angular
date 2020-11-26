import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {BlacklistService} from './blacklist.service';
import {BlacklistDatatableService} from './blacklist-datatable.service';
import {Observable} from 'rxjs';
import {LocationInterface} from '../model/location-interface';
import {NgbdSortableHeader, SortEvent} from '../locations/location-sort/location-sortable.directive';
import {DatePipe} from '@angular/common';
import {BlacklistEntry} from '../model/blacklist-entry';


@Component({
  selector: 'app-blacklist',
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.css'],
  providers: [BlacklistDatatableService]
})
export class BlacklistComponent {

  entries$: Observable<BlacklistEntry[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public blacklistDatatableService: BlacklistDatatableService,
              private datePipe: DatePipe) {
    this.entries$ = blacklistDatatableService.entries$;
    this.total$ = blacklistDatatableService.total$;
  }

  onSort({column, direction}: SortEvent): void {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.blacklistDatatableService.sortColumn = column;
    this.blacklistDatatableService.sortDirection = direction;
  }

  transformDate(date: Date): string {
    return this.datePipe.transform(date, 'HH:mm dd.MM.yyyy');
  }
}
