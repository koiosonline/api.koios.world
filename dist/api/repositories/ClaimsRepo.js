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
exports.getSingleTokenForAccount = exports.createTokenForAccount = exports.newGetTokensForAccount = exports.getAllWhitelistedAccouns = void 0;
const Claims_1 = __importDefault(require("../db/Claims"));
const getAllWhitelistedAccouns = () => __awaiter(void 0, void 0, void 0, function* () {
    return Claims_1.default.find();
});
exports.getAllWhitelistedAccouns = getAllWhitelistedAccouns;
const newGetTokensForAccount = (claimAddress) => __awaiter(void 0, void 0, void 0, function* () {
    return Claims_1.default.find({
        claimAddress: { $regex: claimAddress, $options: "i" },
    });
});
exports.newGetTokensForAccount = newGetTokensForAccount;
const createTokenForAccount = (claimModel) => __awaiter(void 0, void 0, void 0, function* () {
    return Claims_1.default.create(claimModel);
});
exports.createTokenForAccount = createTokenForAccount;
const getSingleTokenForAccount = (claimAddress, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    return Claims_1.default.findOne({
        claimAddress: claimAddress,
        tokenId: tokenId,
    });
});
exports.getSingleTokenForAccount = getSingleTokenForAccount;
//# sourceMappingURL=ClaimsRepo.js.map