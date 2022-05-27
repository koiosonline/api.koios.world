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
exports.getSignature = exports.getTokensForAccount = exports.getProof = exports.getHexProofForList = void 0;
const merkletreejs_1 = require("merkletreejs");
const keccak256_1 = __importDefault(require("keccak256"));
const web3_1 = __importDefault(require("web3"));
const ethers_1 = require("ethers");
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const MerkleClaimModelMaker_1 = require("../util/MerkleClaimModelMaker");
const getHexProofForList = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressList = JSON.parse(fs_1.default.readFileSync("src/api/json/addresses.json", "utf8"));
        const whitelistAddressesLeaves = addressList.claims.map((x) => web3_1.default.utils.soliditySha3(x.tokenId, x.claimAddress));
        const merkleTree = new merkletreejs_1.MerkleTree(whitelistAddressesLeaves, keccak256_1.default, {
            sortPairs: true,
        });
        const whitelistRootHash = merkleTree.getHexRoot();
        console.log("Whitelist Root Hash: " + whitelistRootHash);
        return { rootHash: whitelistRootHash, success: true };
    }
    catch (e) {
        console.log(e);
        return { proof: [], success: false };
    }
});
exports.getHexProofForList = getHexProofForList;
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
const getTokensForAccount = (claimAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressList = JSON.parse(fs_1.default.readFileSync("src/api/json/addresses.json", "utf8"));
        const tokensList = addressList.claims.filter((e) => e.claimAddress == claimAddress);
        return {
            tokens: tokensList,
            success: true,
        };
    }
    catch (e) {
        console.log(e);
        return { tokens: [], success: false };
    }
});
exports.getTokensForAccount = getTokensForAccount;
const getSignature = (claimAddress, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = new ethers_1.ethers.Wallet(process.env.SIGNER_KEY);
        const addressList = JSON.parse(fs_1.default.readFileSync("src/api/json/addresses.json", "utf8"));
        let newMerkleClaimArray = (0, MerkleClaimModelMaker_1.makeObjectArray)(addressList);
        const claimModel = {
            tokenId: tokenId,
            claimAddress: claimAddress,
        };
        if (containsObject(claimModel, newMerkleClaimArray)) {
            const salt = crypto_1.default.randomBytes(16).toString("base64");
            const payload = ethers_1.ethers.utils.defaultAbiCoder.encode(["string", "address", "address", "uint256"], [salt, process.env.CONTRACT_ADDRESS_NFT_NEW, claimAddress, tokenId]);
            let payloadHash = ethers_1.ethers.utils.keccak256(payload);
            const token = yield wallet.signMessage(ethers_1.ethers.utils.arrayify(payloadHash));
            const proof = {
                tokenId: tokenId,
                salt: salt,
                token: token,
            };
            return {
                proof: proof,
                invalid: false,
                success: true,
            };
        }
        return {
            proof: [],
            invalid: true,
            success: false,
        };
    }
    catch (e) {
        console.log(e);
        return { proof: [], invalid: true, success: false };
    }
});
exports.getSignature = getSignature;
const containsObject = (obj, list) => {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].claimAddress === obj.claimAddress &&
            list[i].tokenId === obj.tokenId) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=MintService.js.map