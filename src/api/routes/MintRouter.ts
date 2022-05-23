import express from "express";
import * as mintController from "../controllers/MintController";
export const mintRouter = express.Router();

mintRouter.route("/merkleClaim").post(mintController.post);
mintRouter.route("/getTokensForAccount/:claimAddress").get(mintController.get);
mintRouter.route("/getHexRoot").get(mintController.rootHash);
