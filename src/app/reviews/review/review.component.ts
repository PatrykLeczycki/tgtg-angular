import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Review} from '../../model/review.model';
import {ReviewService} from './review.service';
import {DatePipe} from '@angular/common';
import {NgxGalleryAnimation, NgxGalleryComponent, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions} from 'ngx-gallery-9';
import {LocationInterface} from '../../shared/maplocation';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  @ViewChild(NgxGalleryComponent) ngxGalleryComponent;
  review: Review;
  id: number;

  mapHidden: boolean;
  mapLocation: LocationInterface;

  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private reviewService: ReviewService,
              private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.mapHidden = false;
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.reviewService.get(this.id).subscribe(
      resData => {
        this.review = resData;

        this.review.photos.forEach(photo => this.galleryImages.push({
          small: 'data:image/png;base64,' + photo.data,
          medium: 'data:image/png;base64,' + photo.data,
          big: 'data:image/png;base64,' + photo.data,
          label: String(photo.id)
        }));
        this.mapHidden = this.galleryImages.length > 0;
      }, error => {
        if(error === 'Nie znaleziono podanej recenzji') {
          this.router.navigate(['/reviews'], {
            relativeTo: this.route,
            state: {
              error: error
            }
          });
        }
      }
    );

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = Number(params.get('id'));
      this.reviewService.get(this.id).subscribe(
        resData => {
          this.review = resData
        }, error => {
          if(error === 'Nie znaleziono podanej recenzji') {
            this.router.navigate(['/reviews'], {
              relativeTo: this.route,
              state: {
                error: error
              }
            });
          }
        }
      );
    });

    this.galleryOptions = [
      {
        width: '100%',
        height: '300px',
        thumbnailsColumns: 5,
        imageAnimation: NgxGalleryAnimation.Slide,
        thumbnails: false,
        previewCloseOnEsc: true,
        previewCloseOnClick: true,
        previewKeyboardNavigation: true,
        previewInfinityMove: true,
        previewAnimation: false,
        imageInfinityMove: true,
        image: true,
        thumbnailSize: NgxGalleryImageSize.Contain,
        imageDescription: true
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

  transformDate(date: Date): string {
    return this.datePipe.transform(date, 'HH:mm dd.MM.yyyy');
  }

  onClick() {
    this.mapHidden = !this.mapHidden;
  }
}
