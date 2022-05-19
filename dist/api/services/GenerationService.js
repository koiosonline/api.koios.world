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
exports.checkPassword = exports.generateJson = void 0;
const fs_1 = __importDefault(require("fs"));
const generateJson = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressList = JSON.parse(fs_1.default.readFileSync("src/api/json/addresses.json", "utf8"));
        const mintersFromFile = JSON.parse(fs_1.default.readFileSync("src/api/json/minters.json", "utf8"));
        const minterArray = mintersFromFile.minters;
        let newMerkleClaimArray = makeObjectArray(addressList);
        let tokenIds = createTokenArray(addressList);
        const newFile = generateNewMintList(addressList, newMerkleClaimArray, minterArray, tokenIds);
        const newAddressesFile = {
            claims: newFile,
        };
        fs_1.default.writeFileSync("src/api/json/addresses.json", JSON.stringify(newAddressesFile));
        return {
            success: true,
            data: JSON.parse(fs_1.default.readFileSync("src/api/json/addresses.json", "utf8")),
        };
    }
    catch (e) {
        console.log(e);
        return { success: false };
    }
});
exports.generateJson = generateJson;
const makeObjectArray = (addressList) => {
    let newMerkleClaimArray = [];
    for (let item of addressList.claims) {
        const newItem = {
            tokenId: item.tokenId,
            claimAddress: item.claimAddress,
        };
        newMerkleClaimArray.push(newItem);
    }
    return newMerkleClaimArray;
};
const createTokenArray = (addressList) => {
    let tokenIds = Array.from(Array(100).keys()).map((x) => x + 1);
    for (let item of addressList.claims) {
        for (var i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] === item.tokenId) {
                tokenIds.splice(i, 1);
            }
        }
    }
    return tokenIds;
};
const generateNewMintList = (addressList, newMerkleClaimArray, minterArray, tokenIds) => {
    for (let item of minterArray) {
        const mintable = Math.floor(item.amount / 10);
        const amountInWhitelist = addressList.claims.filter((x) => x.claimAddress == item.minterAddress);
        const amountInWhitelistForAddress = amountInWhitelist.length;
        const amountToAdd = mintable - amountInWhitelistForAddress;
        for (let i = 0; i < amountToAdd; i++) {
            const minterModelAddition = {
                tokenId: tokenIds[(tokenIds.length * Math.random()) | 0],
                claimAddress: item.minterAddress,
            };
            for (var l = 0; l < tokenIds.length; l++) {
                if (tokenIds[l] === minterModelAddition.tokenId) {
                    tokenIds.splice(l, 1);
                }
            }
            newMerkleClaimArray.push(minterModelAddition);
        }
    }
    return newMerkleClaimArray;
};
const checkPassword = (password) => {
    if (password == process.env.GENERATION_PASSWORD) {
        return true;
    }
    return false;
};
exports.checkPassword = checkPassword;
//# sourceMappingURL=GenerationService.js.map