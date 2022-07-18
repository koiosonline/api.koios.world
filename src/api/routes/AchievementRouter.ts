import express from "express";
import * as achievementController from "../controllers/AchievementController";
export const achievementRouter = express.Router({ caseSensitive: false });

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
  .route("/checkAchievement/")
  .get(achievementController.checkExistingAchievement);
