import {Component, QueryList, ViewChildren} from '@angular/core';
import {LocationService} from '../location.service';
import {HttpClient} from '@angular/common/http';
import {LocationDatatableService} from '../location-sort/location-datatable.service';
import {UserLocationBlacklistService} from '../../user/user-location-blacklist/user-location-blacklist.service';
import {Observable} from 'rxjs';
import {LocationInterface} from '../../model/location-interface';
import {NgbdSortableHeader, SortEvent} from '../location-sort/location-sortable.directive';
import {AuthService} from '../../auth/auth.service';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css'],
  providers: [UserLocationBlacklistService, LocationDatatableService]
})
export class LocationListComponent {

  locations$: Observable<LocationInterface[]>;
  total$: Observable<number>;
  error: string;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: LocationDatatableService,
              private httpClient: HttpClient,
              public authService: AuthService,
              private locationService: LocationService,
              private userLocationBlacklistService: UserLocationBlacklistService,
              private datePipe: DatePipe,
              private router: Router) {
    if (authService.user.value) {
      userLocationBlacklistService.updateLocationInterfaces();
    }
    this.locations$ = service.locations$;
    this.total$ = service.total$;

    if(this.router.getCurrentNavigation()
      && this.router.getCurrentNavigation().extras.state
      && this.router.getCurrentNavigation().extras.state.error === 'Nie znaleziono podanego lokalu') {
      this.error = this.router.getCurrentNavigation().extras.state.error;
    }
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
      }
    );
  }

  deleteFromBlacklist(locationId: number): void {
    const userId = this.authService.user.value.id;
    this.locationService.deleteFromBlacklist(userId, locationId).subscribe(
      response => {
        this.userLocationBlacklistService.updateLocationInterfaces();
      }
    );
  }
}
