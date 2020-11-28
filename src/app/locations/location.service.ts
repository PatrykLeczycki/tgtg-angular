import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Location} from '../model/location.model';
import {getApiUrl} from "../shared/utils";

const API_URL = getApiUrl();

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private httpClient: HttpClient) {
  }

  add(rawValue: Location): Observable<object> {
    return this.httpClient.post(
      API_URL + '/location/add', rawValue
    );
  }

  getAll(): Observable<any> {
    return this.httpClient.get(API_URL + '/location/all');
  }

  get(id: number): Observable<any> {
    return this.httpClient.get(API_URL + '/location/' + id);
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
}
