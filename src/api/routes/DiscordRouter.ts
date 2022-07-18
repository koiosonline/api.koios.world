import express from "express";
import * as discordController from "../controllers/DiscordController";
export const discordRouter = express.Router({ caseSensitive: false });

discordRouter.route("/").get(discordController.get);

discordRouter.route("/:username").get(discordController.getUser);
