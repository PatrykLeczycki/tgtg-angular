import {Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {Location} from '../model/location.model';
import {AgmMap, GoogleMapsAPIWrapper, MapsAPILoader} from '@agm/core';
import {ActivatedRoute} from '@angular/router';
import {ReviewService} from '../reviews/review/review.service';
import {LocationService} from '../locations/location.service';
import {Review} from '../model/review.model';
import {DatePipe} from '@angular/common';

declare var MarkerClusterer: any;

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
  selector: 'app-complete-map',
  templateUrl: './complete-map.component.html',
  styleUrls: ['./complete-map.component.css']
})
export class CompleteMapComponent implements OnInit {

  geocoder: any;

  displayLatest = false;

  allLocationsData: Location[];
  latestLocationsData: Location[];

  latestReviews: Review[] = [];

  clickedLocation: Location = null;

  public allLocations: LocationInterface[] = [];
  public latestLocations: LocationInterface[] = [];
  public displayedLocations: LocationInterface[] = [];

  @ViewChild(AgmMap) map: AgmMap;

  constructor(public mapsApiLoader: MapsAPILoader,
              private zone: NgZone,
              private wrapper: GoogleMapsAPIWrapper,
              private locationService: LocationService,
              private route: ActivatedRoute,
              private reviewService: ReviewService,
              private datePipe: DatePipe) {
    this.mapsApiLoader = mapsApiLoader;
    this.zone = zone;
    this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  ngOnInit() {
    this.locationService.getMap()
      .subscribe(locations => {
        this.allLocationsData = locations;
        this.allLocationsData.forEach(location => {
          this.allLocations.push({
            lat: location.address.latitude,
            lng: location.address.longitude,
            marker: {
              lat: location.address.latitude,
              lng: location.address.longitude,
              draggable: true
            },
            zoom: 1
          });
        });
        this.displayedLocations = this.allLocations;
      });

    this.locationService.getLatestMap()
      .subscribe(locations => {
        this.latestLocationsData = locations;
        this.latestLocationsData.forEach(location => {
          this.latestLocations.push({
            lat: location.address.latitude,
            lng: location.address.longitude,
            marker: {
              lat: location.address.latitude,
              lng: location.address.longitude,
              draggable: true
            },
            zoom: 1
          });
        });
      });
  }

  showLocationDetails(i: number) {
    if (this.displayLatest) {
      this.clickedLocation = this.latestLocationsData[i];
    } else {
      this.clickedLocation = this.allLocationsData[i];
    }
    this.reviewService.getLatestLocationReviews(this.clickedLocation.id)
      .subscribe(response => {
        this.latestReviews = response;
      });
  }

  transformDate(date: Date): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy');
  }

  onToggleMap() {
    this.displayLatest = !this.displayLatest;
    if (this.displayLatest) {
      this.displayedLocations = this.latestLocations;
    } else {
      this.displayedLocations = this.allLocations;
    }
  }
}
