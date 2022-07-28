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
exports.fetchUserInfo = exports.fetchDiscordLevels = void 0;
const axios_1 = __importDefault(require("axios"));
const store_1 = __importDefault(require("store"));
const fetchDiscordLevels = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guildId = process.env.GUILD_ID;
        const pages = 7;
        const totalData = [];
        for (let i = 0; i <= pages; i++) {
            const url = `https://mee6.xyz/api/plugins/levels/leaderboard/${guildId}?page=${i}`;
            yield axios_1.default.get(url).then((res) => {
                const data = res.data.players;
                if (data) {
                    totalData.push(data);
                    if (i === 7) {
                        store_1.default.set("discordLevels", totalData);
                    }
                }
            });
        }
    }
    catch (e) {
        console.log(e);
        return;
    }
});
exports.fetchDiscordLevels = fetchDiscordLevels;
const fetchUserInfo = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const callData = store_1.default.get("discordLevels");
    if (callData) {
        let foundUsername;
        callData.map((element) => {
            const result = element.filter((callDataFilter) => callDataFilter.username.toLowerCase() === username.toLowerCase());
            if (result.length >= 1) {
                foundUsername = result;
            }
        });
        return foundUsername;
    }
});
exports.fetchUserInfo = fetchUserInfo;
//# sourceMappingURL=DiscordService.js.map