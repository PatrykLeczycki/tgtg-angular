import {Review} from '../model/review.model';
import {ReviewInterface} from '../model/review-interface';

export class User {
  constructor(
    public id: string,
    public email: string,
    private expiresIn: Date,
    private tokenId: string,
    private roles: string[]) {
  }

  locationBlacklistIds: number[] = [];

  get token() {
    if (!this.expiresIn || new Date() > this.expiresIn) {
      return null;
    }
    return this.tokenId;
  }
}
