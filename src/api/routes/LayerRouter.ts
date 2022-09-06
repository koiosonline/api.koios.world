import express from "express";
import * as layerController from "../controllers/LayerController";
export const layerRouter = express.Router({ caseSensitive: false });

layerRouter.route("/signature").post(layerController.retrieveSignature);
