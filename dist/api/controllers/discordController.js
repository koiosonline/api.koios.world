"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.get = void 0;
const store_1 = __importDefault(require("store"));
const DiscordService_1 = require("../services/DiscordService");
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const callData = store_1.default.get("discordLevels");
    if (callData) {
        res.send(callData);
    }
});
exports.get = get;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const callData = yield (0, DiscordService_1.fetchUserInfo)(req.params.username);
    if (callData) {
        return res.send(callData);
    }
});
exports.getUser = getUser;
//# sourceMappingURL=DiscordController.js.map