import express from "express";
import * as dynamicNFTController from "../controllers/DynamicNFTController";
export const dynamicNFTRouter = express.Router({ caseSensitive: false });

// TODO - add authorization via signature.
//dynamicNFTRouter.route("/create").post(dynamicNFTController.createNewMetadata);

dynamicNFTRouter
  .route("/uploadSingle")
  .post(dynamicNFTController.whitelistSingle);
dynamicNFTRouter
  .route("/uploadMultiple")
  .post(dynamicNFTController.whitelistMultiple);
dynamicNFTRouter
  .route("/getWhitelistedAddress/:address")
  .get(dynamicNFTController.getWhitelistedDynamicAddress);
dynamicNFTRouter
  .route("/signature/:address")
  .get(dynamicNFTController.getSignature);
dynamicNFTRouter.route("/evolve").post(dynamicNFTController.createImage);
