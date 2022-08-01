import IPropModel from "../IPropModel";

export default interface IERC1155MetadataModel {
  tokenId: number;
  name: string;
  image: string;
  description: string;
  external_url: string;
  attributes: IPropModel[];
}
