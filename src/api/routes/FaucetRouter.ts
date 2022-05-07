import express from "express";
import * as faucetController from "../controllers/FaucetController";
export const faucetRouter = express.Router();

faucetRouter.route("/claim").post(faucetController.post);
