import { ethers } from "ethers";
import crypto from "crypto";
import ILayerClaimModel from "../interfaces/ILayerClaimModel";
import { IResponseMessage } from "../interfaces/IResponseMessage";
import { removeCouponForAddress } from "./CouponService";
import { createUserClaim } from "../repositories/LayerRepo";

export const getSignature = async (
  address: string,
  tokenId: number
): Promise<IResponseMessage> => {
  const removeCoupon: IResponseMessage = await removeCouponForAddress(address);
  if (removeCoupon.success) {
    const signatureData = await generateSignature(address, tokenId);
    return {
      success: true,
      message: "Successfully retrieved signature",
      data: signatureData,
    };
  } else {
    return {
      success: false,
      error: true,
      message: "Something went wrong: \n " + removeCoupon.message,
    };
  }
};

const generateSignature = async (
  address: string,
  tokenId: number
): Promise<ILayerClaimModel> => {
  try {
    const wallet = new ethers.Wallet(process.env.SIGNER_KEY);
    const salt = crypto.randomBytes(16).toString("base64");
    const payload = ethers.utils.defaultAbiCoder.encode(
      ["string", "address", "address", "uint256"],
      [salt, process.env.CONTRACT_LAYER_NFT_ADDRESS, address, tokenId]
    );
    let payloadHash = ethers.utils.keccak256(payload);
    const signature: string = await wallet.signMessage(
      ethers.utils.arrayify(payloadHash)
    );
    const createResponse = await createUserClaim({
      salt: salt,
      proof: signature,
      tokenId: tokenId,
      address: address,
      dateAdded: new Date(),
      contractAddress: process.env.CONTRACT_LAYER_NFT_ADDRESS,
    });

    if (createResponse) {
      return {
        saltHash: salt,
        signature: signature,
        tokenId: tokenId,
      };
    } else {
      throw new Error("Could not create user claim");
    }
  } catch (e) {
    return;
  }
};
