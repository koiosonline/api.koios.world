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
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const callData = store_1.default.get("discordLevels");
    if (callData) {
        res.send(callData);
    }
});
exports.get = get;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const callData = store_1.default.get("discordLevels");
    if (callData) {
        let foundUsername;
        callData.map((element) => {
            const result = element.filter((callDataFilter) => callDataFilter.username.toLowerCase() ===
                req.params.username.toLowerCase());
            if (result.length >= 1) {
                foundUsername = result;
            }
        });
        return res.send(foundUsername);
    }
});
exports.getUser = getUser;
//# sourceMappingURL=controller.js.map