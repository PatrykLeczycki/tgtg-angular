import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Observable} from "rxjs";
import {NgbdSortableHeader, SortEvent} from "../../reviews/review-sort/review-sortable.directive";
import {AuthService} from "../../auth/auth.service";
import {DatePipe} from "@angular/common";
import {LocationInterface} from "../../model/location-interface";
import {UserLocationDatatableService} from "./user-location-datatable.service";
import {LocationService} from "../../locations/location.service";

@Component({
  selector: 'app-user-location-list',
  templateUrl: './user-location-list.component.html',
  styleUrls: ['./user-location-list.component.css'],
  providers: [UserLocationDatatableService]
})
export class UserLocationListComponent implements OnInit {

  userLocations$: Observable<LocationInterface[]>;
  total$: Observable<number>;
  locationDeleted: boolean;
  error: string;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(private locationService: LocationService,
              public datatableService: UserLocationDatatableService,
              private authService: AuthService,
              private datePipe: DatePipe) {
    this.userLocations$ = datatableService.locations$;
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

  onDelete(locationId: number) {

    if (confirm("Czy na pewno chcesz usunąć wskazany lokal?")) {
      const userId = this.authService.user.value.id;

      this.locationService.delete(locationId, userId).subscribe(response => {
        this.locationDeleted = true;
        this.datatableService.updateLocationInterfaces();
      }, error => {
        this.error = error;
      });
    }
  }

  ngOnInit(): void {
    this.locationDeleted = false;
  }
}
