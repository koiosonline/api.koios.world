import { Schema, model, models } from "mongoose";
import IERC721ClaimModel from "../interfaces/Schemas/IERC721ClaimModel";

const ERC721ClaimSchema = new Schema<IERC721ClaimModel>({
  address: { type: String, required: true },
  type: { type: Number, required: true },
  dateAchieved: { type: Number, required: true },
});

const ERC721Claims = model("erc721claims", ERC721ClaimSchema);

export default ERC721Claims;
