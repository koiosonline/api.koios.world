"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
const express_1 = __importDefault(require("express"));
const DiscordRouter_1 = require("./routes/DiscordRouter");
const FaucetRouter_1 = require("./routes/FaucetRouter");
exports.services = express_1.default.Router();
exports.services.use("/discord", DiscordRouter_1.discordRouter);
exports.services.use("/faucet", FaucetRouter_1.faucetRouter);
//# sourceMappingURL=index.js.map