import { Contract, providers, ethers } from "ethers";
import crypto from "crypto";
import ILayerClaimModel from "../interfaces/ILayerClaimModel";
import { IResponseMessage } from "../interfaces/IResponseMessage";
import ICouponModel from "../interfaces/Schemas/ICouponModel";
import titanAchievementsContract from "../json/TitanAchievements.json";
import { findAndRemoveCoupon } from "../repositories/CouponRepo";

export const getContract = async (): Promise<Contract> => {
  const provider = new providers.JsonRpcProvider(
    process.env.DYNAMIC_NFT_PROVIDER
  );

  return new Contract(
    process.env.CONTRACT_LAYER_NFT_ADDRESS,
    titanAchievementsContract.abi,
    provider
  );
};

export const getSignature = async (
  address: string,
  tokenId: number
): Promise<IResponseMessage> => {
  try {
    const removeCoupon = await findAndRemoveCoupon(address);
    if (removeCoupon) {
      const signatureData = await generateSignature(address, tokenId);
      return {
        success: true,
        message: "Successfully retrieved signature",
        data: signatureData,
      };
    }
    return {
      success: false,
      error: true,
      message: "Something went wrong: \n " + removeCoupon,
    };
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "Signature fetch failed: \n " + e,
    };
  }
};

const generateSignature = async (
  address: string,
  tokenId: number
): Promise<ILayerClaimModel> => {
  try {
    const wallet = new ethers.Wallet(process.env.SIGNER_KEY);
    const saltHash = crypto.randomBytes(16).toString("base64");
    const payload = ethers.utils.defaultAbiCoder.encode(
      ["string", "address", "address", "uint256"],
      [saltHash, process.env.CONTRACT_LAYER_NFT_ADDRESS, address, tokenId]
    );
    let payloadHash = ethers.utils.keccak256(payload);
    const signature: string = await wallet.signMessage(
      ethers.utils.arrayify(payloadHash)
    );
    return {
      saltHash,
      signature,
      tokenId,
    };
  } catch (e) {
    return;
  }
};
