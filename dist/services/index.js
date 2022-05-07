"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("./discord/index");
const index_2 = require("./faucet/index");
exports.services = express_1.default.Router();
exports.services.use("/discord", index_1.discordRouter);
exports.services.use("/faucet", index_2.faucetRouter);
//# sourceMappingURL=index.js.map