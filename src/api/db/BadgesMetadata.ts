import { Schema, model, models } from "mongoose";
import IBadgesMetadataModel from "../interfaces/Schemas/IBadgesMetadataModel";

const BadgesMetadataSchema = new Schema<IBadgesMetadataModel>({
  tokenId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  external_url: { type: String, required: true },
  attributes: [{ trait_type: String, value: String }],
});

const BadgesMetadata = model("badgesMetadata", BadgesMetadataSchema);

export default BadgesMetadata;
