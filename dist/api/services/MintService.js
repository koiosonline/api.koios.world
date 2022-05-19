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
exports.getProof = void 0;
const merkletreejs_1 = require("merkletreejs");
const keccak256_1 = __importDefault(require("keccak256"));
const web3_1 = __importDefault(require("web3"));
const fs_1 = __importDefault(require("fs"));
const getProof = (claimAddress, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressList = JSON.parse(fs_1.default.readFileSync("src/api/json/addresses.json", "utf8"));
        const whitelistAddressesLeaves = addressList.claims.map((x) => web3_1.default.utils.soliditySha3(x.tokenId, x.claimAddress));
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
        return { proof: [], success: false };
    }
});
exports.getProof = getProof;
//# sourceMappingURL=MintService.js.map