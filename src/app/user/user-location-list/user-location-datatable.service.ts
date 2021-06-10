import {Injectable, PipeTransform} from '@angular/core';
import {SortColumn, SortDirection} from '../../reviews/review-sort/review-sortable.directive';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {AuthService} from '../../auth/auth.service';
import {LocationInterface} from "../../model/location-interface";
import {LocationService} from "../../locations/location.service";

interface SearchResult {
  locations: LocationInterface[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  searchCityTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number | Date, v2: string | number | Date) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(locations: LocationInterface[], column: SortColumn, direction: string): LocationInterface[] {
  if (direction === '' || column === '') {
    return locations;
  } else {
    return [...locations].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matchesName(location: LocationInterface, term: string, pipe: PipeTransform) {
  return location.name.toLowerCase().includes(term.toLowerCase());
}

function matchesCity(location: LocationInterface, term: string, pipe: PipeTransform) {
  return location.city.toLowerCase().includes(term.toLowerCase());
}

@Injectable()
export class UserLocationDatatableService {

  locationInterfaces: LocationInterface[] = [];

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _locations$ = new BehaviorSubject<LocationInterface[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    searchCityTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  updateLocationInterfaces() {
    const userId = Number(this.authService.user.value.id);
    this.locationInterfaces = [];
    this.locationService.getAllByUserId(userId).subscribe(response => {
      response.forEach(location => {
        this.locationInterfaces.push({
          id: location.id,
          name: location.name,
          street: location.address.street + ' ' + location.address.buildingNo,
          city: location.address.city,
          rating: location.rating
        });
      });
      this._search$.next();
    });
  }

  constructor(private pipe: DecimalPipe,
              private locationService: LocationService,
              private authService: AuthService) {
    this.updateLocationInterfaces();
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      console.log(result.locations);
      this._locations$.next(result.locations);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get locations$() {
    return this._locations$.asObservable();
  }

  get total$() {
    return this._total$.asObservable();
  }

  get loading$() {
    return this._loading$.asObservable();
  }

  get page() {
    return this._state.page;
  }

  get pageSize() {
    return this._state.pageSize;
  }

  get searchNameTerm() {
    return this._state.searchTerm;
  }

  get searchCityTerm() {
    return this._state.searchCityTerm;
  }

  set page(page: number) {
    this._set({page});
  }

  set pageSize(pageSize: number) {
    this._set({pageSize});
  }

  set searchNameTerm(searchTerm: string) {
    this._set({searchTerm});
  }

  set searchCityTerm(searchCityTerm: string) {
    this._set({searchCityTerm});
  }

  set sortColumn(sortColumn: SortColumn) {
    this._set({sortColumn});
  }

  set sortDirection(sortDirection: SortDirection) {
    this._set({sortDirection});
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm, searchCityTerm} = this._state;

    let locations = sort(this.locationInterfaces, sortColumn, sortDirection);
    locations = locations.filter(location => matchesName(location, searchTerm, this.pipe));
    locations = locations.filter(location => matchesCity(location, searchCityTerm, this.pipe));

    const total = locations.length;
    locations = locations.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({locations, total});
  }
}
