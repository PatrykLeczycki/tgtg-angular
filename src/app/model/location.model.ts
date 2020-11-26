import {Address} from './address.model';
import {Review} from './review.model';

export class Location {
  constructor(public id: number,
              public address: Address,
              public name: string,
              public rating: number,
              public reviews: Review[]) {
  }
}
