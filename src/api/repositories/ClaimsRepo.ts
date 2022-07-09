import Claims from "../db/Claims";
import IClaimModel from "../interfaces/Schemas/IClaimModel";

export const getAllWhitelistedAccouns = async (): Promise<IClaimModel[]> => {
  return Claims.find();
};

export const newGetTokensForAccount = async (
  claimAddress: string
): Promise<IClaimModel[]> => {
  return Claims.find({
    claimAddress: claimAddress,
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
    claimAddress: claimAddress,
    tokenId: tokenId,
  });
};
