import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Location} from '../model/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private httpClient: HttpClient) {
  }

  add(rawValue: Location): Observable<object> {
    return this.httpClient.post(
      'http://pleczycki.pl/tgtg-spring/location/add', rawValue
    );
  }

  getAll(): Observable<any> {
    return this.httpClient.get('http://pleczycki.pl/tgtg-spring/location/all');
  }

  get(id: number): Observable<any> {
    return this.httpClient.get('http://pleczycki.pl/tgtg-spring/location/' + id);
  }

  addToBlacklist(userId: string, locationId: string): Observable<any> {
    return this.httpClient.post('http://pleczycki.pl/tgtg-spring/blacklist/add', {
      userId, locationId
    });
  }

  getUserBlacklist(userId: number): Observable<any> {
    return this.httpClient.get('http://pleczycki.pl/tgtg-spring/blacklist/user/' + userId);
  }

  deleteFromBlacklist(userId: string, locationId: number) {
    return this.httpClient.post('http://pleczycki.pl/tgtg-spring/blacklist/delete', {
      userId, locationId
    });
  }

  getMap(): Observable<any> {
    return this.httpClient.get('http://pleczycki.pl/tgtg-spring/location/map');
  }

  getLatestMap(): Observable<any> {
    return this.httpClient.get('http://pleczycki.pl/tgtg-spring/location/map/latest');
  }

  edit(location: Location, id: number): Observable<any> {
    return this.httpClient.post('http://pleczycki.pl/tgtg-spring/location/edit/' + id, location);
  }
}
