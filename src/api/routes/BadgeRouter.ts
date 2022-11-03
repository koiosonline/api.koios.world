import express from "express";
import * as badgeController from "../controllers/BadgeController";
export const badgeRouter = express.Router({ caseSensitive: false });

badgeRouter.route("/getBadges/:address").get(badgeController.getBadges);
badgeRouter.route("/uploadBadges").post(badgeController.uploadBadges);
badgeRouter.route("/uploadSingleBadge").post(badgeController.uploadBadge);
badgeRouter.route("/signature").post(badgeController.retrieveSignature);
