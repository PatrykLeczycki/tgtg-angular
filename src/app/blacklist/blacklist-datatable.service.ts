import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {BlacklistService} from './blacklist.service';
import {SortColumn, SortDirection} from '../reviews/review-sort/review-sortable.directive';
import {AuthService} from '../auth/auth.service';
import {BlacklistEntry} from '../model/blacklist-entry';

interface SearchResult {
  entries: BlacklistEntry[];
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

function sort(entries: BlacklistEntry[], column: SortColumn, direction: string): BlacklistEntry[] {
  if (direction === '' || column === '') {
    return entries;
  } else {
    return [...entries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matchesName(entry: BlacklistEntry, term: string, pipe: PipeTransform) {
  return entry.name.toLowerCase().includes(term.toLowerCase());
}

function matchesStreet(entry: BlacklistEntry, term: string, pipe: PipeTransform) {
  return entry.street.toLowerCase().includes(term.toLowerCase());
}

function matchesCity(entry: BlacklistEntry, term: string, pipe: PipeTransform) {
  return entry.city.toLowerCase().includes(term.toLowerCase());
}

@Injectable()
export class BlacklistDatatableService {

  blacklistEntries: BlacklistEntry[] = [];

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _entries$ = new BehaviorSubject<BlacklistEntry[]>([]);
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
              private blacklistService: BlacklistService,
              private authService: AuthService) {
    if (authService.user.value) {
      this.updateLocationInterfaces();
    }
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._entries$.next(result.entries);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  updateLocationInterfaces() {
    this.blacklistEntries = [];
    this.blacklistService.getAll().subscribe(response => {
      this.authService.user.value.locationBlacklistIds = [];
      response.forEach(entry => {
        this.blacklistEntries.push({
          id: entry.location.id,
          name: entry.location.name,
          street: entry.location.address.street + ' ' + entry.location.address.buildingNo,
          city: entry.location.address.city,
          rating: entry.location.rating,
          count: entry.count
        });
        this.authService.user.value.locationBlacklistIds.push(entry.location.id);
      });
    });
  }

  get entries$() {
    return this._entries$.asObservable();
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
    let entries = sort(this.blacklistEntries, sortColumn, sortDirection);
    // 2.1. filter by location name
    entries = entries.filter(review => matchesName(review, searchNameTerm, this.pipe));

    // 2.2. filter by location street
    entries = entries.filter(review => matchesStreet(review, searchStreetTerm, this.pipe));

    // 2.3. filter by location city
    entries = entries.filter(review => matchesCity(review, searchCityTerm, this.pipe));
    const total = entries.length;
    // 3. paginate
    entries = entries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({entries: entries, total});
  }
}
