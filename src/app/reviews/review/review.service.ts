import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {getApiUrl} from "../../shared/utils";
import {catchError} from "rxjs/operators";

const API_URL = getApiUrl();

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get(API_URL + '/review/all');
  }

  getAllByUserId(id: number): Observable<any> {
    return this.http.get(API_URL + '/review/all/user/' + id);
  }

  get(id: number): Observable<any> {
    return this.http.get(API_URL + '/review/get/' + id)
      .pipe(catchError(this.handleError));
  }

  getLatest(limit: number): Observable<any> {
    return this.http.get(API_URL + '/review/latest', {
      params: new HttpParams().set('limit', String(limit))
    });
  }

  add(data: FormData): Observable<any> {
    return this.http.post(
      API_URL + '/review/add', data
    );
  }

  edit(data: FormData, id: number): Observable<any> {
    return this.http.post(
      API_URL + '/review/edit/' + id, data
    );
  }

  delete(id: number) {
    return this.http.delete(API_URL + '/review/delete/' + id);
  }

  getLatestLocationReviews(id: number): Observable<any> {
    return this.http.get(API_URL + '/review/location/' + id + '/latest');
  }

  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Wystąpiły problemy z serwerem. Prosimy odczekać chwilę i spróbować ponownie.';
    if (!errorRes.error || !errorRes.error.message) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.message) {
      case 'Review not found':
        errorMessage = 'Nie znaleziono podanej recenzji';
        break;
    }
    return throwError(errorMessage);
  }
}
