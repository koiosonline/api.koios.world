import express from "express";

import { discordRouter } from "./routes/DiscordRouter";
import { faucetRouter } from "./routes/FaucetRouter";
import { generationRouter } from "./routes/GenerationRouter";
import { mintRouter } from "./routes/MintRouter";
import { achievementRouter } from "./routes/AchievementRouter";

export const services = express.Router();

services.use("/discord", discordRouter);
services.use("/faucet", faucetRouter);
services.use("/mint", mintRouter);
services.use("/generate", generationRouter);
services.use("/achievement", achievementRouter);
