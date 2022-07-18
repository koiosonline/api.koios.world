import { Schema, model, models } from "mongoose";
import IAchievementModel from "../interfaces/Schemas/IAchievementModel";

const achievementSchema = new Schema<IAchievementModel>({
  address: { type: String, required: true },
  dateAchieved: { type: Number, required: true },
  type: { type: Number, required: true },
  name: { type: String, required: true },
  tokenId: { type: Number, required: true },
});

const Achievements =
  models.Achievements || model("achievements", achievementSchema);

export default Achievements;
