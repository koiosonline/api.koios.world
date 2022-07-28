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
const ethers_1 = require("ethers");
const Claims_1 = __importDefault(require("../db/Claims"));
const getAllWhitelistedAccouns = () => __awaiter(void 0, void 0, void 0, function* () {
    return Claims_1.default.find();
});
exports.getAllWhitelistedAccouns = getAllWhitelistedAccouns;
const newGetTokensForAccount = (claimAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const model = yield Claims_1.default.find({
        claimAddress: ethers_1.ethers.utils.getAddress(claimAddress),
    });
    if (model.length > 0) {
        return model;
    }
    else {
        return Claims_1.default.find({
            claimAddress: claimAddress.toLowerCase(),
        });
    }
});
exports.newGetTokensForAccount = newGetTokensForAccount;
const createTokenForAccount = (claimModel) => __awaiter(void 0, void 0, void 0, function* () {
    return Claims_1.default.create(claimModel);
});
exports.createTokenForAccount = createTokenForAccount;
const getSingleTokenForAccount = (claimAddress, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    const model = yield Claims_1.default.findOne({
        claimAddress: ethers_1.ethers.utils.getAddress(claimAddress),
        tokenId: tokenId,
    });
    if (model) {
        console.log(model);
        return model;
    }
    else {
        return Claims_1.default.findOne({
            claimAddress: claimAddress.toLowerCase(),
            tokenId: tokenId,
        });
    }
});
exports.getSingleTokenForAccount = getSingleTokenForAccount;
//# sourceMappingURL=ClaimsRepo.js.map