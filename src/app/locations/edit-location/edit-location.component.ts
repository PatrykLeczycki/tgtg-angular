import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '../../model/location.model';
import {LocationService} from '../location.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from "rxjs";
import {CanComponentDeactivate} from "../../shared/can-component-deactivate";
import {MapService} from "../../map/map.service";

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.css']
})
export class EditLocationComponent implements OnInit, CanComponentDeactivate {
  locationForm: FormGroup;
  location: Location;
  id: number;
  error: string;
  submitted = false;

  constructor(private locationService: LocationService,
              private mapService: MapService,
              private route: ActivatedRoute,
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

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.locationService.get(this.id)
      .subscribe(location => {
        this.location = location;
        this.locationForm.patchValue({
          'address': {
            'buildingNo': this.location.address.buildingNo,
            'city': this.location.address.city,
            'street': this.location.address.street
          },
          'name': this.location.name
        });
      });
  }

  onSubmit() {
    this.submitted = true;

    const location = this.locationForm.value;

    const addressString =
      this.locationForm.value.address.street + ' ' +
      this.locationForm.value.address.buildingNo + ' ' +
      this.locationForm.value.address.city;


    const coords = this.mapService.getCoordinates(addressString);

    coords.then(place => {
      location.address.latitude = place.geometry.location.lat();
      location.address.longitude = place.geometry.location.lng();

      this.locationService
        .edit(location, this.id)
        .subscribe(responseData => {
          this.router.navigate(['/locations', this.id]);
        }, error => {
          this.submitted = false;
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
