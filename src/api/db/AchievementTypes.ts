import { Schema, model, models } from "mongoose";
import IAchievementType from "../interfaces/Schemas/IAchievementType";

const achievementTypeSchema = new Schema<IAchievementType>({
  name: { type: String, required: true },
  type: { type: Number, required: true },
  tokenId: { type: Number, required: true },
});

const AchievementTypes =
  models.achievementTypes ||
  model("achievementTypes", achievementTypeSchema, "achievementTypes");

export default AchievementTypes;
