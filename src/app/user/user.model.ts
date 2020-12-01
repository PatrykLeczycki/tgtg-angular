export class User {
  constructor(
    public id: string,
    public email: string,
    private expiresIn: Date,
    private tokenId: string,
    private roles: string[]) {
    this.expiresIn = new Date(Date.UTC(this.expiresIn.getFullYear(), this.expiresIn.getMonth(), this.expiresIn.getDate(), this.expiresIn.getHours(), this.expiresIn.getMinutes()));
  }

  locationBlacklistIds: number[] = [];

  get token() {
    if (!this.expiresIn || new Date() > this.expiresIn) {
      return null;
    }
    return this.tokenId;
  }
}
