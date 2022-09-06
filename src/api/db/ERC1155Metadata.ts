import { Schema, model, models } from "mongoose";
import IERC1155MetadataModel from "../interfaces/Schemas/IERC1155MetadataModel";

const ERC1155MetadataSchema = new Schema<IERC1155MetadataModel>({
  tokenId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  external_url: { type: String, required: true },
  attributes: [{ trait_type: String, value: String }],
});

const ERC1155Metadata = model("erc1155metadata", ERC1155MetadataSchema);

export default ERC1155Metadata;
