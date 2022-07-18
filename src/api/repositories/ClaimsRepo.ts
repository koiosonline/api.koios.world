import Claims from "../db/Claims";
import IClaimModel from "../interfaces/Schemas/IClaimModel";

export const getAllWhitelistedAccounts = async (): Promise<IClaimModel[]> => {
  return Claims.find();
};

export const newGetTokensForAccount = async (
  claimAddress: string
): Promise<IClaimModel[]> => {
  return Claims.find({
    claimAddress: { $regex: claimAddress, $options: "i" },
  });
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
  return Claims.findOne({
    claimAddress: { $regex: claimAddress, $options: "i" },
    tokenId: tokenId,
  });
};
