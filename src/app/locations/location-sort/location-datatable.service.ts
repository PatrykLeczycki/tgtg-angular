import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from './location-sortable.directive';
import {LocationInterface} from '../../model/location-interface';
import {LocationService} from '../location.service';

interface SearchResult {
  locations: LocationInterface[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchNameTerm: string;
  searchStreetTerm: string;
  searchCityTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

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

function matchesStreet(location: LocationInterface, term: string, pipe: PipeTransform) {
  return location.street.toLowerCase().includes(term.toLowerCase());
}

function matchesCity(location: LocationInterface, term: string, pipe: PipeTransform) {
  return location.city.toLowerCase().includes(term.toLowerCase());
}

@Injectable()
export class LocationDatatableService {

  locationInterfaces: LocationInterface[] = [];

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _locations$ = new BehaviorSubject<LocationInterface[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchNameTerm: '',
    searchStreetTerm: '',
    searchCityTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe,
              private locationService: LocationService) {
    this.locationService.getAll().subscribe(response => {
        response.forEach(location => {
          this.locationInterfaces.push({
            id: location.id,
            name: location.name,
            street: location.address.street + ' ' + location.address.buildingNo,
            city: location.address.city,
            rating: location.rating
          });
        });
      this._search$.pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      ).subscribe(result => {
        this._locations$.next(result.locations);
        this._total$.next(result.total);
      });

      this._search$.next();
    });
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
    return this._state.searchNameTerm;
  }

  get searchStreetTerm() {
    return this._state.searchStreetTerm;
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

  set searchNameTerm(searchNameTerm: string) {
    this._set({searchNameTerm});
  }

  set searchStreetTerm(searchStreetTerm: string) {
    this._set({searchStreetTerm});
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
    const {sortColumn, sortDirection, pageSize, page, searchNameTerm, searchStreetTerm, searchCityTerm} = this._state;

    // 1. sort
    let locations = sort(this.locationInterfaces, sortColumn, sortDirection);
    // 2.1. filter by location name
    locations = locations.filter(review => matchesName(review, searchNameTerm, this.pipe));

    // 2.2. filter by location street
    locations = locations.filter(review => matchesStreet(review, searchStreetTerm, this.pipe));

    // 2.3. filter by location city
    locations = locations.filter(review => matchesCity(review, searchCityTerm, this.pipe));
    const total = locations.length;
    // 3. paginate
    locations = locations.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({locations: locations, total});
  }
}
