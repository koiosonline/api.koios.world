import { ethers } from "ethers";
import Claims from "../db/Claims";
import IClaimModel from "../interfaces/Schemas/IClaimModel";

export const getAllWhitelistedAccounts = async (): Promise<IClaimModel[]> => {
  return Claims.find();
};

export const newGetTokensForAccount = async (
  claimAddress: string
): Promise<IClaimModel[]> => {
  const model = await Claims.find({
    claimAddress: ethers.utils.getAddress(claimAddress),
  });
  if (model.length > 0) {
    return model;
  } else {
    return Claims.find({
      claimAddress: claimAddress.toLowerCase(),
    });
  }
};

export const createTokenForAccount = async (
  claimModel: IClaimModel
): Promise<IClaimModel> => {
  return Claims.create(claimModel);
};

export const getSingleTokenForAccount = async (
  claimAddress: string,
  tokenId: number
): Promise<IClaimModel> => {
  const model = await Claims.findOne({
    claimAddress: ethers.utils.getAddress(claimAddress),
    tokenId: tokenId,
  });

  if (model) {
    return model;
  } else {
    return Claims.findOne({
      claimAddress: claimAddress.toLowerCase(),
      tokenId: tokenId,
    });
  }
};
