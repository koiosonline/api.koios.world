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
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = void 0;
const MintService_1 = require("../services/MintService");
const post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const merkleClaim = req.body;
        if (merkleClaim.claimAddress && merkleClaim.tokenId) {
            const proof = yield (0, MintService_1.getProof)(merkleClaim.claimAddress, merkleClaim.tokenId);
            if (proof.success) {
                res.send(proof);
                return;
            }
        }
        res.status(400).send("Bad Request");
        return;
    }
    catch (err) {
        console.log(err);
        res.status(400).send("Bad Request");
    }
});
exports.post = post;
//# sourceMappingURL=MintController.js.map