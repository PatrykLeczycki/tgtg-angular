import {Component, Input, OnInit} from '@angular/core';
import {Location} from '../../model/location.model';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {LocationService} from '../location.service';
import {BlacklistService} from '../../blacklist/blacklist.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  location: Location;
  counter: number;
  id: number;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private locationService: LocationService,
              private blacklistService: BlacklistService) {
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.locationService.get(this.id).subscribe(
      resData => {
        this.location = resData;
        this.blacklistService.countLocationOnBlacklist(this.id)
          .subscribe(countResponse => {
            this.counter = countResponse;
          });
      }
    );

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = Number(params.get('id'));
      this.locationService.get(this.id).subscribe(
        resData => this.location = resData
      );
    });
  }
}
