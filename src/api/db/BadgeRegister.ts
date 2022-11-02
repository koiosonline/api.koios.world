import { Schema, model, models } from "mongoose";
import IBadgeRegisterModel from "../interfaces/Schemas/IBadgeRegisterModel";

const badgeRegisterSchema = new Schema<IBadgeRegisterModel>({
  address: { type: String, required: true },
  type: { type: Number, required: true },
});

const BadgesRegister = model("badgesRegister", badgeRegisterSchema);

export default BadgesRegister;
