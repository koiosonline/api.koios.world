import IPropModel from "../IPropModel";

export default interface IBadgesMetadataModel {
  tokenId: number;
  name: string;
  image: string;
  description: string;
  external_url: string;
  attributes: IPropModel[];
}
