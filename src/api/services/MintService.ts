import { ethers } from "ethers";
import crypto from "crypto";
import { ECDSAProof } from "../interfaces/ECDSAProof";
import {
  createTokenForAccount,
  getSingleTokenForAccount,
  newGetTokensForAccount,
} from "../repositories/ClaimsRepo";
import IClaimModel from "../interfaces/Schemas/IClaimModel";

export const getTokensForAccount = async (claimAddress: string) => {
  try {
    const tokenList = await newGetTokensForAccount(claimAddress);
    return {
      tokens: tokenList,
      success: true,
    };
  } catch (e) {
    return { tokens: [], success: false };
  }
};

export const createClaim = async (claim: IClaimModel) => {
  try {
    const res = await createTokenForAccount(claim);
    return {
      success: true,
      instance: res,
    };
  } catch (e) {
    return {
      success: false,
      instance: [],
    };
  }
};

export const getSignature = async (claimAddress: string, tokenId: number) => {
  try {
    const wallet = new ethers.Wallet(process.env.SIGNER_KEY);
    const data = await getSingleTokenForAccount(claimAddress, tokenId);
    if (data) {
      const salt = crypto.randomBytes(16).toString("base64");
      const payload = ethers.utils.defaultAbiCoder.encode(
        ["string", "address", "address", "uint256"],
        [salt, process.env.CONTRACT_ADDRESS_NFT, claimAddress, tokenId]
      );
      let payloadHash = ethers.utils.keccak256(payload);
      const token: string = await wallet.signMessage(
        ethers.utils.arrayify(payloadHash)
      );
      const proof: ECDSAProof = {
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
  } catch (e) {
    return { proof: [], invalid: true, success: false };
  }
};
