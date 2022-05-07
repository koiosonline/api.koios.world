import express from "express";
import * as controller from "./controller";
export const faucetRouter = express.Router();

faucetRouter.route("/claim").post(controller.post);
