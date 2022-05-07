import express from "express";

import { discordRouter } from "./discord/index";
import { faucetRouter } from "./faucet/index";

export const services = express.Router();

services.use("/discord", discordRouter);
services.use("/faucet", faucetRouter);
