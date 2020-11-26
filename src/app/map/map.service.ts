import {Injectable} from '@angular/core';
import {MapsAPILoader} from '@agm/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  geocoder: any;

  constructor(public mapsApiLoader: MapsAPILoader) {
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  getCoordinates(address): Promise<any> {

    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({
          address: address
        },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            resolve(results[0]);
          } else {
            reject(new Error(status));
          }
        }
      );
    });
  }
}
