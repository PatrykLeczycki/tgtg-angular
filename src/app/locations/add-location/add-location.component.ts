import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LocationService} from '../location.service';
import {Location} from '../../model/location.model';
import {CanComponentDeactivate} from '../../shared/can-component-deactivate';
import {Observable} from 'rxjs';
import {MapService} from '../../map/map.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css']
})
export class AddLocationComponent implements OnInit, CanComponentDeactivate {

  // locations: Location[] = [];
  locationForm: FormGroup;
  error: string = null;
  submitted = false;

  constructor(private locationService: LocationService,
              private mapService: MapService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.locationForm = new FormGroup({
      'address': new FormGroup({
        'buildingNo': new FormControl('', Validators.required),
        'city': new FormControl('', Validators.required),
        'street': new FormControl('', Validators.required)
      }),
      'name': new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.submitted = true;

    const addressString =
      this.locationForm.value.address.street + ' ' +
      this.locationForm.value.address.buildingNo + ' ' +
      this.locationForm.value.address.city;

    const coords = this.mapService.getCoordinates(addressString);

    const location = this.locationForm.value;

    coords.then(place => {
      location.address.latitude = place.geometry.location.lat();
      location.address.longitude = place.geometry.location.lng();

      this.locationService
        .add(location)
        .subscribe(responseData => {
          this.locationService.getAll()
            .subscribe(response => {
              // this.locations = response;
            });
          this.router.navigate(['/locations', Number(responseData['message'])]);
        }, error => {
          this.submitted = false;
          console.log(error);
        });
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.locationForm.dirty && !this.submitted) {
      return confirm('Wprowadzone zmiany zostaną utracone. Czy chcesz opuścić stronę?');
    }
    return true;
  }
}
