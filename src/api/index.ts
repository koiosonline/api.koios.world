import express from "express";

import { discordRouter } from "./routes/DiscordRouter";
import { faucetRouter } from "./routes/FaucetRouter";

export const services = express.Router();

services.use("/discord", discordRouter);
services.use("/faucet", faucetRouter);
