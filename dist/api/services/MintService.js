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
exports.getSignature = exports.createClaim = exports.getTokensForAccount = void 0;
const ethers_1 = require("ethers");
const crypto_1 = __importDefault(require("crypto"));
const ClaimsRepo_1 = require("../repositories/ClaimsRepo");
//TODO - old code - remove
{
    /*
   TODO remove this old code
  export const getHexProofForList = async () => {
    try {
      const addressList = JSON.parse(
        fs.readFileSync("src/api/json/addresses.json", "utf8")
      );
  
      const whitelistAddressesLeaves = addressList.claims.map((x) =>
        Web3.utils.soliditySha3(x.tokenId, x.claimAddress)
      );
      const merkleTree = new MerkleTree(whitelistAddressesLeaves, keccak256, {
        sortPairs: true,
      });
  
      const whitelistRootHash = merkleTree.getHexRoot();
      console.log("Whitelist Root Hash: " + whitelistRootHash);
  
      return { rootHash: whitelistRootHash, success: true };
    } catch (e) {
      console.log(e);
      return { proof: [], success: false };
    }
  };
  
  export const getProof = async (claimAddress: string, tokenId: number) => {
    try {
      const addressList = JSON.parse(
        fs.readFileSync("src/api/json/addresses.json", "utf8")
      );
  
      const whitelistAddressesLeaves = addressList.claims.map((x) =>
        Web3.utils.soliditySha3(x.tokenId, x.claimAddress)
      );
      const merkleTree = new MerkleTree(whitelistAddressesLeaves, keccak256, {
        sortPairs: true,
      });
  
      const whitelistRootHash = merkleTree.getHexRoot();
      console.log("Whitelist Root Hash: " + whitelistRootHash);
  
      console.log(claimAddress + " : " + tokenId);
  
      const hashedAddress = Web3.utils.soliditySha3(tokenId, claimAddress);
      const proof = merkleTree.getHexProof(hashedAddress);
      console.log(proof);
  
      return { proof: proof, success: true };
    } catch (e) {
      console.log(e);
      return { proof: [], success: false };
    }
  };
  */
}
const getTokensForAccount = (claimAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenList = yield (0, ClaimsRepo_1.newGetTokensForAccount)(claimAddress);
        return {
            tokens: tokenList,
            success: true,
        };
    }
    catch (e) {
        console.log(e);
        return { tokens: [], success: false };
    }
});
exports.getTokensForAccount = getTokensForAccount;
const createClaim = (claim) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, ClaimsRepo_1.createTokenForAccount)(claim);
        return {
            success: true,
            instance: res,
        };
    }
    catch (e) {
        console.log(e);
        return {
            success: false,
            instance: [],
        };
    }
});
exports.createClaim = createClaim;
const getSignature = (claimAddress, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = new ethers_1.ethers.Wallet(process.env.SIGNER_KEY);
        const data = yield (0, ClaimsRepo_1.getSingleTokenForAccount)(claimAddress, tokenId);
        if (data) {
            const salt = crypto_1.default.randomBytes(16).toString("base64");
            const payload = ethers_1.ethers.utils.defaultAbiCoder.encode(["string", "address", "address", "uint256"], [salt, process.env.CONTRACT_ADDRESS_NFT, claimAddress, tokenId]);
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
//# sourceMappingURL=MintService.js.map