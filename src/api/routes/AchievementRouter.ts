import express from "express";
import * as achievementController from "../controllers/AchievementController";
export const achievementRouter = express.Router();

achievementRouter
  .route("/uploadSingle")
  .post(achievementController.createSingle);
achievementRouter
  .route("/uploadMultiple")
  .post(achievementController.createMultiple);
achievementRouter
  .route("/getAllAchievements")
  .get(achievementController.getAllAchievements);
achievementRouter
  .route("/findAddress/:address")
  .get(achievementController.checkWhitelistedAccount);
achievementRouter
  .route("/checkAchievement/")
  .get(achievementController.checkExistingAchievement);
