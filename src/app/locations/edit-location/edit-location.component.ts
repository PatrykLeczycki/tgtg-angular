import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '../../model/location.model';
import {HttpClient} from '@angular/common/http';
import {LocationService} from '../location.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.css']
})
export class EditLocationComponent implements OnInit {
  locationForm: FormGroup;
  location: Location;
  id: number;
  error: string;

  constructor(private locationService: LocationService,
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
    this.locationService
      .edit(this.locationForm.value, this.id)
      .subscribe(responseData => {
        this.router.navigate(['/locations', this.id]);
      }, error => {
        console.log(error);
      });
  }
}
