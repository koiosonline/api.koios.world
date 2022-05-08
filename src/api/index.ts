import express from "express";

import { discordRouter } from "./routes/DiscordRouter";
import { faucetRouter } from "./routes/FaucetRouter";
import { mintRouter } from "./routes/MintRouter";

export const services = express.Router();

services.use("/discord", discordRouter);
services.use("/faucet", faucetRouter);
services.use("/mint", mintRouter);
