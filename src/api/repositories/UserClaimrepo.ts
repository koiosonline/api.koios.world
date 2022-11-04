import UserClaims from "../db/UserClaims";
import IUserClaim from "../interfaces/Schemas/IUserClaim";

export const createBadgeClaim = async (
  model: IUserClaim
): Promise<IUserClaim> => {
  return UserClaims.create(model);
};

export const findBadges = async (
  address: string,
  contractAddress: string
): Promise<IUserClaim[]> => {
  return UserClaims.find({
    address: address,
    contractAddress: contractAddress,
  });
};

export const findExistingBadge = async (
  address: string,
  tokenId: number,
  contractAddress: string
): Promise<IUserClaim> => {
  return UserClaims.findOne({
    address: address,
    tokenId: tokenId,
    contractAddress: contractAddress,
  });
};
