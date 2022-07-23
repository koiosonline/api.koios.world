import express from "express";
import * as whitelistController from "../controllers/WhitelistController";
export const whitelistRouter = express.Router({ caseSensitive: false });

whitelistRouter
  .route("/findAddress/:address")
  .get(whitelistController.getWhitelistedAddress);
whitelistRouter
  .route("/uploadSingle")
  .post(whitelistController.whitelistSingle);
whitelistRouter
  .route("/uploadMultiple")
  .post(whitelistController.whitelistMultiple);
