import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ReviewService} from '../review/review.service';
import {Router} from '@angular/router';
import {LocationService} from '../../locations/location.service';
import {Location} from '../../model/location.model';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions} from 'ngx-gallery-9';
import {AuthService} from '../../auth/auth.service';
import {Observable, of} from 'rxjs';
import {CanComponentDeactivate} from '../../shared/can-component-deactivate';
import {UserReviewDatatableService} from '../../user/user-review-list/user-review-datatable.service';
import {MapService} from '../../map/map.service';
import {Review} from "../../model/review.model";

import * as moment from 'moment';
import 'moment/locale/pl';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css'],
  providers: [UserReviewDatatableService],
  encapsulation: ViewEncapsulation.None
})
export class AddReviewComponent implements OnInit, CanComponentDeactivate {

  locations$: Observable<Location[]>;

  chooseExistingLocation = false;
  chosenLocationId = 1;
  locations: Location[] = [];
  reviewForm: FormGroup;
  error: string = null;
  stars = 3;

  submitted = false;

  selectedFiles: FileList;
  selectedFile = null;
  changeImage = false;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  deletedImagesIds: number[] = [];
  imagesCount = 0;
  imageUploadError: string = null;

  constructor(private reviewService: ReviewService,
              private router: Router,
              private locationService: LocationService,
              private authService: AuthService,
              private userReviewDatatableService: UserReviewDatatableService,
              private mapService: MapService) {
  }

  getLocations(term: string = null): void {
    this.locationService.getAll()
      .subscribe(response => {
        let items = response;
        if (term) {
          items = items.filter(x => x.fullName.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        items.map(item => {
          item.fullName =
            item.name + ' ' +
            item.address.city + ' ' +
            item.address.street + ' ' +
            item.address.buildingNo;
        });
        this.locations$ = of(items);
      });
  }

  ngOnInit(): void {
    this.reviewForm = new FormGroup({
      'comment': new FormControl(''),
      'standardPrice': new FormControl(null, [Validators.required]),
      'discountPrice': new FormControl(null, [Validators.required]),
      'rating': new FormControl(this.stars, Validators.required),
      'pickupTime': new FormControl('', Validators.required),
      'location': new FormGroup({
        'address': new FormGroup({
          'buildingNo': new FormControl('', Validators.required),
          'city': new FormControl('', Validators.required),
          'street': new FormControl('', Validators.required)
        }),
        'name': new FormControl('', Validators.required),
      })
    });

    this.getLocations();

    this.locationService.getAll()
      .subscribe(response => {
        this.locations = response;
        this.chosenLocationId = this.locations[0].id;
      });

    this.galleryOptions = [
      {
        width: '600px',
        height: '100px',
        thumbnailsColumns: 5,
        imageAnimation: NgxGalleryAnimation.Slide,
        thumbnails: true,
        previewCloseOnEsc: true,
        previewCloseOnClick: true,
        previewKeyboardNavigation: true,
        previewInfinityMove: true,
        previewAnimation: false,
        imageInfinityMove: true,
        image: false,
        thumbnailSize: NgxGalleryImageSize.Contain,
        imageDescription: true,
        thumbnailActions: [{icon: 'fa fa-times-circle', onClick: this.deleteImage.bind(this), titleText: 'delete'}]
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];
  }

  onSubmit() {
    this.submitted = true;
    this.reviewForm.patchValue({
      rating: this.stars,
    });

    this.reviewForm.value.pickupTime = moment(this.reviewForm.value.pickupTime);
    const data: FormData = new FormData();
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        if (!this.deletedImagesIds.includes(i)) {
          data.append('files', this.selectedFiles.item(i));
        }
      }
    }

    data.append('id', new Blob([JSON.stringify(this.authService.user.value.id)], {
      type: 'application/json'
    }));

    const addressString =
      this.reviewForm.value.location.address.street + ' ' +
      this.reviewForm.value.location.address.buildingNo + ' ' +
      this.reviewForm.value.location.address.city;

    const coords = this.mapService.getCoordinates(addressString);

    coords.then(place => {

      if (this.chooseExistingLocation) {
        this.reviewForm.value.location.id = this.chosenLocationId;
      } else {
        this.reviewForm.value.location.address.latitude = place.geometry.location.lat();
        this.reviewForm.value.location.address.longitude = place.geometry.location.lng();
      }

      data.append('review', new Blob([JSON.stringify(this.reviewForm.value)], {
        type: 'application/json'
      }));

      this.reviewService
        .add(data)
        .subscribe(responseData => {
          let review: Review = responseData;
          this.userReviewDatatableService.updateReviewInterfaces();
          this.router.navigate(['/reviews', review.id]);
        }, error => {
          this.submitted = false;
        });
    });
  }

  onLocationChoose() {
    const chosenLocation = this.locations.find(loc => loc.id === this.chosenLocationId);
    this.reviewForm.patchValue({
      location: {
        name: chosenLocation.name,
        address: {
          street: chosenLocation.address.street,
          buildingNo: chosenLocation.address.buildingNo,
          city: chosenLocation.address.city
        }
      }
    });
  }

  onChooseExisting() {
    this.chooseExistingLocation = !this.chooseExistingLocation;

    if (this.chooseExistingLocation) {
      const chosenLocation = this.locations.find(loc => loc.id === this.chosenLocationId);
      this.reviewForm.patchValue({
        location: {
          name: chosenLocation.name,
          address: {
            street: chosenLocation.address.street,
            buildingNo: chosenLocation.address.buildingNo,
            city: chosenLocation.address.city
          }
        }
      });
    } else {
      this.onClear();
    }
  }

  selectFiles(event) {
    this.galleryImages = [];
    this.imagesCount = 0;
    this.selectedFiles = event.target.files;
    const files = event.target.files;
    this.imagesCount += files.length;
    if (files && this.imagesCount <= 5) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.galleryImages.push({
            small: e.target.result,
            medium: e.target.result,
            big: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    } else if (this.imagesCount > 5) {
      this.imagesCount -= files.length;
      this.imageUploadError = 'Dodawanie zdjęć zakończone niepowodzeniem - limit zdjęć przekroczony';
    }
  }

  onClear() {
    this.reviewForm.reset();
  }

  deleteImage(event, index): void {
    this.deletedImagesIds.push(index);
    this.galleryImages.splice(index, 1);
    this.imagesCount--;
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.reviewForm.dirty && !this.submitted) {
      return confirm('Wprowadzone zmiany zostaną utracone. Czy chcesz opuścić stronę?');
    }
    return true;
  }
}
