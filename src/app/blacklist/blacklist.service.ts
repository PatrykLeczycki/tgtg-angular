import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlacklistService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any> {
    return this.httpClient.get('http://pleczycki.pl/tgtg-spring/blacklist/all');
  }

  countLocationOnBlacklist(locationId: number): Observable<any> {
    return this.httpClient.get('http://pleczycki.pl/tgtg-spring/blacklist/count/' + locationId);
  }
}
