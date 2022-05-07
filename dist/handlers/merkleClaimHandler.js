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
const merkletreejs_1 = require("merkletreejs");
const keccak256_1 = __importDefault(require("keccak256"));
const web3_1 = __importDefault(require("web3"));
const addresses_json_1 = __importDefault(require("../data/addresses.json"));
const merkleClaimHandler = ({ claimAddress, tokenId, res }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const whitelistAddressesLeaves = addresses_json_1.default.claims.map((x) => web3_1.default.utils.soliditySha3(x.tokenID, x.claimAddress));
        const merkleTree = new merkletreejs_1.MerkleTree(whitelistAddressesLeaves, keccak256_1.default, {
            sortPairs: true,
        });
        const whitelistRootHash = merkleTree.getHexRoot();
        console.log("Whitelist Root Hash: " + whitelistRootHash);
        console.log(claimAddress + " : " + tokenId);
        const hashedAddress = web3_1.default.utils.soliditySha3(tokenId, claimAddress);
        const proof = merkleTree.getHexProof(hashedAddress);
        console.log(proof);
        return { proof: proof, success: true };
    }
    catch (e) {
        console.log(e);
        return res.status(400).send("Bad Request");
    }
});
exports.default = merkleClaimHandler;
//# sourceMappingURL=merkleClaimHandler.js.map