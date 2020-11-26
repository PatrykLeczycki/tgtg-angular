import {Review} from './review.model';

export class Photo {
  // constructor(public id: number,
  //             // public review: Review,
  //             public fileName: string,
  //             public url: string) {
  // }
  constructor(public id: string,
              // public review: Review,
              public name: string,
              public type: string,
              public data: string) {
  }
}
