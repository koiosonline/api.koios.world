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
exports.signature = exports.rootHash = exports.get = exports.post = void 0;
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
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params);
        const claimAddress = req.params.claimAddress;
        if (claimAddress) {
            const tokens = yield (0, MintService_1.getTokensForAccount)(claimAddress);
            if (tokens.success) {
                res.send(tokens);
                return;
            }
        }
        res.status(404).send("Bad Request");
        return;
    }
    catch (err) {
        console.log(err);
        res.status(404).send("Bad Request");
    }
});
exports.get = get;
const rootHash = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const root = yield (0, MintService_1.getHexProofForList)();
        if (root.success) {
            res.send(root);
            return;
        }
        res.status(500).send("Internal Server Error");
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});
exports.rootHash = rootHash;
const signature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const merkleClaim = req.body;
        if (merkleClaim.claimAddress && merkleClaim.tokenId) {
            const proof = yield (0, MintService_1.getSignature)(merkleClaim.claimAddress, merkleClaim.tokenId);
            if (proof.success) {
                res.send(proof);
                return;
            }
            if (proof.invalid) {
                res.status(400).send("Not Whitelisted!");
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
exports.signature = signature;
//# sourceMappingURL=MintController.js.map