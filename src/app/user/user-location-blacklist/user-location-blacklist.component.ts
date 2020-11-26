import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Observable} from 'rxjs';
import {LocationInterface} from '../../model/location-interface';
import {NgbdSortableHeader, SortEvent} from '../../locations/location-sort/location-sortable.directive';
import {LocationDatatableService} from '../../locations/location-sort/location-datatable.service';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';
import {LocationService} from '../../locations/location.service';
import {DatePipe} from '@angular/common';
import {UserLocationBlacklistService} from './user-location-blacklist.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-location-blacklist',
  templateUrl: './user-location-blacklist.component.html',
  styleUrls: ['./user-location-blacklist.component.css'],
  providers: [UserLocationBlacklistService]
})
export class UserLocationBlacklistComponent implements OnInit {

  locations$: Observable<LocationInterface[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: UserLocationBlacklistService,
              private httpClient: HttpClient,
              private authService: AuthService,
              private locationService: LocationService,
              private router: Router,
              private datePipe: DatePipe) {
    this.locations$ = service.locations$;
    this.total$ = service.total$;
  }

  onSort({column, direction}: SortEvent): void {
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

  ngOnInit(): void {
  }

  deleteFromBlacklist(locationId: number): void {
    const userId = this.authService.user.value.id;
    this.locationService.deleteFromBlacklist(userId, locationId).subscribe(
      response => {
        this.service.updateLocationInterfaces();
      }
    );
  }
}
