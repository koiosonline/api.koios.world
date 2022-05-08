import express from "express";
import * as mintController from "../controllers/MintController";
export const mintRouter = express.Router();

mintRouter.route("/merkleClaim").post(mintController.post);
