import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {getApiUrl} from "../../shared/utils";

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
    return this.http.get(API_URL + '/review/' + id);
  }

  getLatest(limit: number): Observable<any> {
    return this.http.get(API_URL + '/review/latest', {
      params: new HttpParams().set('limit', String(limit))
    });
  }

  add(data: FormData): Observable<object> {
    return this.http.post(
      API_URL + '/review/add', data
    );
  }

  edit(data: FormData, id: number): Observable<object> {
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
}
