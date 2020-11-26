import {Location} from './location.model';
import {Photo} from './photo.model';

export class Review {
  constructor(public id: number,
              public comment: string,
              public location: Location,
              // public photos: Photo[],
              public photos: Photo[],
              public pickupTime: Date,
              public discountPrice: number,
              public standardPrice: number,
              public rating: number,
              public userId: number) {
  }
}
