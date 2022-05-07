import express from "express";
import * as controller from "./controller";
export const discordRouter = express.Router();

discordRouter.route("/").get(controller.get);

discordRouter.route("/:username").get(controller.getUser);
