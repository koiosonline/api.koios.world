import { Schema, model } from "mongoose";
import IUserClaim from "../interfaces/Schemas/IUserClaim";

const userClaimsSchema = new Schema<IUserClaim>({
  address: { type: String, required: true },
  salt: { type: String, required: true },
  proof: { type: String, required: true },
  contractAddress: { type: String, required: true },
  tokenId: { type: Number, required: true },
  dateAdded: { type: Date, required: true },
});

const UserClaims = model("userclaims", userClaimsSchema);

export default UserClaims;
