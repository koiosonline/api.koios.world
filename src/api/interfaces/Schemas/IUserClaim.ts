export default interface IUserClaim {
  address: string;
  tokenId: number;
  salt: string;
  proof: string;
  contractAddress: string;
  dateAdded: Date;
}
