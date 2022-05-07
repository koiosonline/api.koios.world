import express from "express";
import * as discordController from "../controllers/DiscordController";
export const discordRouter = express.Router();

discordRouter.route("/").get(discordController.get);

discordRouter.route("/:username").get(discordController.getUser);
