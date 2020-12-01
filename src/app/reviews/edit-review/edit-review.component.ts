import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Location} from '../../model/location.model';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {ReviewService} from '../review/review.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationService} from '../../locations/location.service';
import {Review} from '../../model/review.model';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions} from 'ngx-gallery-9';
import {Observable, of} from 'rxjs';
import {MapService} from '../../map/map.service';
import {CanComponentDeactivate} from '../../shared/can-component-deactivate';
import * as moment from 'moment'

@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrls: ['./edit-review.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditReviewComponent implements OnInit, CanComponentDeactivate {

  locations$: Observable<Location[]>;

  loading = true;
  error: string = null;

  id: number = null;
  review: Review = null;
  submitted = false;

  chooseExistingLocation = false;
  chosenLocationId = 1;
  locations: Location[] = [];
  reviewForm: FormGroup;
  stars = 0;

  // IMAGES

  currentGalleryOptions: NgxGalleryOptions[] = [];
  newGalleryOptions: NgxGalleryOptions[] = [];
  currentImages: NgxGalleryImage[] = [];
  newAddedImages: NgxGalleryImage[] = [];
  deletedNewImagesIds: number[] = [];
  deletedImagesDatabaseIds: number[] = [];
  selectedFiles: FileList;
  selectedFile = null;
  changeImage = false;
  imagesCount: number;
  imageUploadError: string = null;


  constructor(private reviewService: ReviewService,
              private router: Router,
              private route: ActivatedRoute,
              private locationService: LocationService,
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
      'standardPrice': new FormControl('', [Validators.required]),
      'discountPrice': new FormControl('', [Validators.required]),
      'rating': new FormControl('', Validators.required),
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

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.reviewService.get(this.id).subscribe(
      resData => {
        this.review = resData;
        this.imagesCount = this.review.photos.length;
        this.stars = this.review.rating;
        this.reviewForm.patchValue({
          'comment': this.review.comment,
          'standardPrice': this.review.standardPrice,
          'discountPrice': this.review.discountPrice,
          'rating': this.review.rating,
          'pickupTime': moment(this.review.pickupTime).format('yyyy-MM-DDTHH:mm:ss'),
          'location': {
            'address': {
              'buildingNo': this.review.location.address.buildingNo,
              'city': this.review.location.address.city,
              'street': this.review.location.address.street,
            },
            'name': this.review.location.name
          }
        });

        this.review.photos.forEach(photo => this.currentImages.push({
          small: 'data:image/png;base64,' + photo.data,
          medium: 'data:image/png;base64,' + photo.data,
          big: 'data:image/png;base64,' + photo.data,
          label: photo.id
        }));
      }
    );

    this.getLocations();

    this.locationService.getAll()
      .subscribe(response => {
        this.locations = response;
        this.chosenLocationId = this.locations[0].id;
      });

    this.currentGalleryOptions = [
      {
        // width: '300%',
        height: '100px',
        thumbnailsColumns: 5,
        thumbnailsPercent: 10,
        imageAnimation: NgxGalleryAnimation.Slide,
        thumbnails: true,
        previewCloseOnEsc: true,
        previewCloseOnClick: true,
        previewKeyboardNavigation: true,
        previewInfinityMove: true,
        previewAnimation: false,
        imageInfinityMove: true,
        image: false,
        thumbnailSize: NgxGalleryImageSize.Cover,
        imageDescription: true,
        thumbnailActions: [{icon: 'fa fa-times-circle', onClick: this.deleteCurrentImage.bind(this), titleText: 'delete'}]
      },
      // max-width 800
      {
        breakpoint: 800,
        // width: '300%',
        height: '100px',
        imagePercent: 80,
        thumbnailsPercent: 10,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        thumbnailsPercent: 10,
        preview: false
      }
    ];

    this.newGalleryOptions = [
      {
        // width: '300%',
        height: '100px',
        thumbnailsColumns: 5,
        imageAnimation: NgxGalleryAnimation.Slide,
        thumbnails: true,
        thumbnailsPercent: 10,
        previewCloseOnEsc: true,
        previewCloseOnClick: true,
        previewKeyboardNavigation: true,
        previewInfinityMove: true,
        previewAnimation: false,
        imageInfinityMove: true,
        image: false,
        thumbnailSize: NgxGalleryImageSize.Contain,
        imageDescription: true,
        thumbnailActions: [{icon: 'fa fa-times-circle', onClick: this.deleteNewImage.bind(this), titleText: 'delete'}]
      },
      // max-width 800
      {
        breakpoint: 800,
        // width: '300%',
        height: '100px',
        imagePercent: 80,
        thumbnailsPercent: 10,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        height: '100px',
        thumbnailsPercent: 10,
        preview: false
      }
    ];
  }

  onSubmit() {
    this.submitted = true;
    this.reviewForm.patchValue({
      rating: this.stars,
    });

    const data: FormData = new FormData();

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        if (!this.deletedNewImagesIds.includes(i)) {
          data.append('files', this.selectedFiles.item(i));
        }
      }
    }

    data.append('deleted', new Blob([JSON.stringify(this.deletedImagesDatabaseIds)], {
      type: 'application/json'
    }));

    let addressString = '';
    let coords = null;
    if (this.chooseExistingLocation) {
      this.reviewForm.value.location.id = this.chosenLocationId;
    } else {
      addressString =
        this.reviewForm.value.location.address.street + ' ' +
        this.reviewForm.value.location.address.buildingNo + ' ' +
        this.reviewForm.value.location.address.city;

      coords = this.mapService.getCoordinates(addressString);
    }

    if (coords) {
      coords.then(place => {

        this.reviewForm.value.location.address.latitude = place.geometry.location.lat();
        this.reviewForm.value.location.address.longitude = place.geometry.location.lng();

        data.append('review', new Blob([JSON.stringify(this.reviewForm.value)], {
          type: 'application/json'
        }));

        this.reviewService
          .edit(data, this.id)
          .subscribe(responseData => {
            let review: Review = responseData;
            this.router.navigate(['/reviews', review.id]);
          }, error => {
            console.log(error);
          });
      });
    } else {
      this.reviewForm.value.location.id = this.chosenLocationId;

      data.append('review', new Blob([JSON.stringify(this.reviewForm.value)], {
        type: 'application/json'
      }));

      this.reviewService
        .edit(data, this.id)
        .subscribe(responseData => {
          let review: Review = responseData;
          this.router.navigate(['/reviews', review.id]);
        }, error => {
          console.log(error);
        });
    }
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
    this.imageUploadError = null;
    this.imagesCount = this.review.photos.length;
    this.newAddedImages = [];
    this.selectedFiles = event.target.files;
    const files = event.target.files;
    this.imagesCount += files.length;
    if (files && (this.imagesCount <= 5)) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.newAddedImages.push({
            small: e.target.result,
            medium: e.target.result,
            big: e.target.result,
            label: null
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

  deleteCurrentImage(event, index): void {
    this.deletedNewImagesIds.push(index);
    const label = this.currentImages[index].label;
    if (label) {
      this.deletedImagesDatabaseIds.push(Number(label));
    }
    this.currentImages.splice(index, 1);
    this.imagesCount--;
  }

  deleteNewImage(event, index): void {
    this.deletedNewImagesIds.push(index);
    this.newAddedImages.splice(index, 1);
    this.imagesCount--;
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.reviewForm.dirty && !this.submitted) {
      return confirm('Wprowadzone zmiany zostaną utracone. Czy chcesz opuścić stronę?');
    }
    return true;
  }
}
