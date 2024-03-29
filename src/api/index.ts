import express from "express";

import { discordRouter } from "./routes/DiscordRouter";
import { faucetRouter } from "./routes/FaucetRouter";
import { generationRouter } from "./routes/GenerationRouter";
import { mintRouter } from "./routes/MintRouter";
import { achievementRouter } from "./routes/AchievementRouter";
import { couponRouter } from "./routes/CouponRouter";
import { whitelistRouter } from "./routes/WhitelistRouter";
import { dynamicNFTRouter } from "./routes/DynamicNFTRouter";
import { metadataRouter } from "./routes/MetadataRouter";
import { layerRouter } from "./routes/LayerRouter";
import { badgeRouter } from "./routes/BadgeRouter";

export const services = express.Router();

services.use("/discord", discordRouter);
services.use("/faucet", faucetRouter);
services.use("/mint", mintRouter);
services.use("/generate", generationRouter);
services.use("/achievement", achievementRouter);
services.use("/coupon", couponRouter);
services.use("/whitelist", whitelistRouter);
services.use("/dynamicNFT", dynamicNFTRouter);
services.use("/metadata", metadataRouter);
services.use("/layer", layerRouter);
services.use("/badge", badgeRouter);
