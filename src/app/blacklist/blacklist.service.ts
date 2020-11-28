import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {getApiUrl} from "../shared/utils";

const API_URL = getApiUrl();

@Injectable({
  providedIn: 'root'
})
export class BlacklistService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any> {
    return this.httpClient.get(API_URL + '/blacklist/all');
  }

  countLocationOnBlacklist(locationId: number): Observable<any> {
    return this.httpClient.get(API_URL + '/blacklist/count/' + locationId);
  }
}
