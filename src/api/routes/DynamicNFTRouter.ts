import express from "express";
import * as dynamicNFTController from "../controllers/DynamicNFTController";
export const dynamicNFTRouter = express.Router({ caseSensitive: false });

// TODO - add authorization via signature.
//dynamicNFTRouter.route("/create").post(dynamicNFTController.createNewMetadata);
