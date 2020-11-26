import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Review} from '../../model/review.model';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getAll(): Observable<any> {
    return this.http.get('http://pleczycki.pl/tgtg-spring/review/all');
  }

  getAllByUserId(id: number): Observable<any> {
    return this.http.get('http://pleczycki.pl/tgtg-spring/review/all/user/' + id);
  }

  get(id: number): Observable<any> {
    return this.http.get('http://pleczycki.pl/tgtg-spring/review/' + id);
  }

  getLatest(limit: number): Observable<any> {
    return this.http.get('http://pleczycki.pl/tgtg-spring/review/latest', {
      params: new HttpParams().set('limit', String(limit))
    });
  }

  add(data: FormData): Observable<object> {
    return this.http.post(
      'http://pleczycki.pl/tgtg-spring/review/add', data
    );
  }

  edit(data: FormData, id: number): Observable<object> {
    return this.http.post(
      'http://pleczycki.pl/tgtg-spring/review/edit/' + id, data
    );
  }

  delete(id: number) {
    return this.http.delete('http://pleczycki.pl/tgtg-spring/review/delete/' + id);
  }

  getLatestLocationReviews(id: number): Observable<any> {
    return this.http.get('http://pleczycki.pl/tgtg-spring/review/location/' + id + '/latest');
  }
}
