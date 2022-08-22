import { Schema, model, models } from "mongoose";
import IClaimModel from "../interfaces/Schemas/IClaimModel";

const claimModelSchema = new Schema<IClaimModel>({
  tokenId: { type: Number, required: true },
  claimAddress: { type: String, required: true },
  whitelist: { type: Boolean, required: true },
});

const Claims = model("claims", claimModelSchema);

export default Claims;
