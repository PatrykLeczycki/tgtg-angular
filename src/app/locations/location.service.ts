import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Location} from '../model/location.model';
import {getApiUrl} from "../shared/utils";
import {catchError} from "rxjs/operators";

const API_URL = getApiUrl();

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private httpClient: HttpClient) {
  }

  add(rawValue: Location): Observable<any> {
    return this.httpClient.post(
      API_URL + '/location/add', rawValue
    );
  }

  getAll(): Observable<any> {
    return this.httpClient.get(API_URL + '/location/all');
  }

  getAllByUserId(id: number): Observable<any> {
    return this.httpClient.get(API_URL + '/location/all/user/' + id);
  }

  get(id: number): Observable<any> {
    return this.httpClient.get(API_URL + '/location/get/' + id)
      .pipe(catchError(this.handleError));
  }

  addToBlacklist(userId: string, locationId: string): Observable<any> {
    return this.httpClient.post(API_URL + '/blacklist/add', {
      userId, locationId
    });
  }

  getUserBlacklist(userId: number): Observable<any> {
    return this.httpClient.get(API_URL + '/blacklist/user/' + userId);
  }

  deleteFromBlacklist(userId: string, locationId: number) {
    return this.httpClient.post(API_URL + '/blacklist/delete', {
      userId, locationId
    });
  }

  getMap(): Observable<any> {
    return this.httpClient.get(API_URL + '/location/map');
  }

  getLatestMap(): Observable<any> {
    return this.httpClient.get(API_URL + '/location/map/latest');
  }

  edit(location: Location, id: number): Observable<any> {
    return this.httpClient.post(API_URL + '/location/edit/' + id, location);
  }

  delete(locationId: number, userId: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: userId
    }

    return this.httpClient.delete(API_URL + '/location/delete/' + locationId, options)
      .pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Wystąpiły problemy z serwerem. Prosimy odczekać chwilę i spróbować ponownie.';
    if (!errorRes.error || !errorRes.error.message) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.message) {
      case 'Location not found':
        errorMessage = 'Nie znaleziono podanego lokalu';
        break;
      case 'Location contains reviews':
        errorMessage = 'Nie można usunąć lokalu, ponieważ posiada on przypisane recenzje.';
        break;
    }
    return throwError(errorMessage);
  }
}
