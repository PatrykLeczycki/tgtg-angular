import {Injectable, PipeTransform} from '@angular/core';
import {ReviewInterface} from '../../model/review-interface';
import {SortColumn, SortDirection} from '../../reviews/review-sort/review-sortable.directive';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import {ReviewService} from '../../reviews/review/review.service';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {AuthService} from '../../auth/auth.service';

interface SearchResult {
  reviews: ReviewInterface[];
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

function sort(reviews: ReviewInterface[], column: SortColumn, direction: string): ReviewInterface[] {
  if (direction === '' || column === '') {
    return reviews;
  } else {
    return [...reviews].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matchesLocationName(review: ReviewInterface, term: string, pipe: PipeTransform) {
  return review.locationName.toLowerCase().includes(term.toLowerCase());
}

function matchesCity(review: ReviewInterface, term: string, pipe: PipeTransform) {
  return review.locationCity.toLowerCase().includes(term.toLowerCase());
}

@Injectable()
export class UserReviewDatatableService {

  reviewInterfaces: ReviewInterface[] = [];

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _reviews$ = new BehaviorSubject<ReviewInterface[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    searchCityTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  updateReviewInterfaces() {
    const userId = Number(this.authService.user.value.id);
    this.reviewInterfaces = [];
    this.reviewService.getAllByUserId(userId).subscribe(response => {
      response.forEach(review => {
        this.reviewInterfaces.push({
          id: review.id,
          locationName: review.location.name,
          locationCity: review.location.address.city,
          rating: review.rating,
          pickupTime: review.pickupTime
        });
      });
      this._search$.next();
    });
  }

  constructor(private pipe: DecimalPipe,
              private reviewService: ReviewService,
              private authService: AuthService) {
    this.updateReviewInterfaces();
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._reviews$.next(result.reviews);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get reviews$() {
    return this._reviews$.asObservable();
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

  get searchLocationNameTerm() {
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

  set searchLocationNameTerm(searchTerm: string) {
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

    let reviews = sort(this.reviewInterfaces, sortColumn, sortDirection);
    reviews = reviews.filter(review => matchesLocationName(review, searchTerm, this.pipe));
    reviews = reviews.filter(review => matchesCity(review, searchCityTerm, this.pipe));

    const total = reviews.length;
    reviews = reviews.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({reviews, total});
  }
}
