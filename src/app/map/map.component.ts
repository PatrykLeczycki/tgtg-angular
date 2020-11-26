import {Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {AgmMap, GoogleMapsAPIWrapper, MapsAPILoader} from '@agm/core';
import {FormGroup} from '@angular/forms';
import {Location} from '../model/location.model';

declare var google: any;

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

interface LocationInterface {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?: string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

  geocoder: any;
  @Input()
  locationData: Location;

  public location: LocationInterface;

  addressForm: FormGroup;

  @ViewChild(AgmMap) map: AgmMap;
  loaded = false;

  constructor(public mapsApiLoader: MapsAPILoader,
              private zone: NgZone,
              private wrapper: GoogleMapsAPIWrapper) {
    this.mapsApiLoader = mapsApiLoader;
    this.zone = zone;
    this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  ngOnInit() {
    this.location = {
      lat: this.locationData.address.latitude,
      lng: this.locationData.address.longitude,
      marker: {
        lat: this.locationData.address.latitude,
        lng: this.locationData.address.longitude,
        draggable: true
      },
      zoom: 1
    };
  }
}
