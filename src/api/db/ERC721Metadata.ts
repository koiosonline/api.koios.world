import { Schema, model, models } from "mongoose";
import IERC721MetadataModel from "../interfaces/Schemas/IERC721MetadataModel";

const ERC721MetadataSchema = new Schema<IERC721MetadataModel>({
  tokenId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  external_url: { type: String, required: true },
  attributes: [{ trait_type: String, value: String }],
});

const ERC721Metadata = model("erc721metadata", ERC721MetadataSchema);

export default ERC721Metadata;
