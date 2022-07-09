import express from "express";
import * as mintController from "../controllers/MintController";
export const mintRouter = express.Router();

mintRouter.route("/getTokensForAccount/:claimAddress").get(mintController.get);
mintRouter.route("/signature").post(mintController.signature);
//mintRouter.route("/create").post(mintController.create);
mintRouter.route("/getAll").get(mintController.getAll);
