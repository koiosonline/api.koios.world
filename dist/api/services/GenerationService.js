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
const MerkleClaimModelMaker_1 = require("../util/MerkleClaimModelMaker");
const axios_1 = __importDefault(require("axios"));
const generateJson = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressList = JSON.parse(fs_1.default.readFileSync("src/api/json/addresses.json", "utf8"));
        const mintersNew = yield getMinterList();
        const minterArray = mintersNew.data.users;
        let newMerkleClaimArray = (0, MerkleClaimModelMaker_1.makeObjectArray)(addressList);
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
const getMinterList = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
  {
    users(orderBy: transferedMint, orderDirection: desc, where: {transferedMint_gt: 0}) {
      address
      transferedMint
    }
  }
          `;
    const URL = process.env.SUBGRAPH_URL;
    const body = JSON.stringify({ query: query });
    const test = yield axios_1.default.post(URL, body);
    return test.data;
});
const createTokenArray = (addressList) => {
    let tokenIds = Array.from(Array(1000).keys()).map((x) => x + 1);
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
        const mintable = Math.floor(item.transferedMint / 1000000000000000000 / 10);
        const amountInWhitelist = addressList.claims.filter((x) => x.claimAddress == item.address);
        const amountInWhitelistForAddress = amountInWhitelist.length;
        const amountToAdd = mintable - amountInWhitelistForAddress;
        for (let i = 0; i < amountToAdd; i++) {
            const minterModelAddition = {
                tokenId: tokenIds[(tokenIds.length * Math.random()) | 0],
                claimAddress: item.address,
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