import { Schema, model, models } from "mongoose";
import IWhitelistModel from "../interfaces/Schemas/IWhitelistModel";

const whitelistSchema = new Schema<IWhitelistModel>({
  address: { type: String, required: true },
  name: { type: String, required: true },
});

const Whitelists = models.Whitelists || model("whitelists", whitelistSchema);

export default Whitelists;
