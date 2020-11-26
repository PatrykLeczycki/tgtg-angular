import {DatePipe, DecimalPipe} from '@angular/common';
import {Component, QueryList, ViewChildren} from '@angular/core';
import {Observable} from 'rxjs';

import {LocationDatatableService} from './location-datatable.service';
import {NgbdSortableHeader, SortEvent} from './location-sortable.directive';
import {LocationInterface} from '../../model/location-interface';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';
import {LocationService} from '../location.service';
import {UserLocationBlacklistService} from '../../user/user-location-blacklist/user-location-blacklist.service';

@Component({
  selector: 'app-location-table',
  templateUrl: './location-table.html',
  styleUrls: ['./location-table.css'],
  providers: [LocationDatatableService, UserLocationBlacklistService, DecimalPipe]
})
export class LocationTableComponent {
  locations$: Observable<LocationInterface[]>;
  total$: Observable<number>;

  userBlacklistIds: number[] = [];

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: LocationDatatableService,
              private httpClient: HttpClient,
              public authService: AuthService,
              private locationService: LocationService,
              private userLocationBlacklistService: UserLocationBlacklistService,
              private datePipe: DatePipe) {
    if (authService.user.value) {
      console.log(authService.user);
      userLocationBlacklistService.updateLocationInterfaces();
      this.userBlacklistIds = authService.user.value.locationBlacklistIds;
    }

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

  onBlacklist(id: number): void {
    const userId = this.authService.user.value.id;
    this.locationService.addToBlacklist(userId, String(id)).subscribe(response => {
        this.userLocationBlacklistService.updateLocationInterfaces();
        this.userBlacklistIds = this.authService.user.value.locationBlacklistIds;
      }
    );
  }

  deleteFromBlacklist(locationId: number): void {
    const userId = this.authService.user.value.id;
    this.locationService.deleteFromBlacklist(userId, locationId).subscribe(
      response => {
        this.userLocationBlacklistService.updateLocationInterfaces();
        this.userBlacklistIds = this.authService.user.value.locationBlacklistIds;
      }
    );
  }
}
