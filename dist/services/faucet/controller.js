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
exports.post = void 0;
const axios_1 = __importDefault(require("axios"));
const executeClaim_1 = __importDefault(require("./executeClaim"));
const post = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const googleRes = yield axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${req.body.captchaToken}`);
    const data = googleRes.data;
    res.send(yield (0, executeClaim_1.default)(req.body.claimerAddress, data));
});
exports.post = post;
//# sourceMappingURL=controller.js.map