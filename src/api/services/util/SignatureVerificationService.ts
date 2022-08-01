import { ethers } from "ethers";
import { findWhitelistedAccount } from "../../repositories/WhitelistRepo";
import { findExistingCoupon } from "../../repositories/CouponRepo";
import ICouponModel from "../../interfaces/Schemas/ICouponModel";

export const verifyMessage = async (
  saltHash: string,
  signature: string
): Promise<boolean> => {
  const address = ethers.utils.verifyMessage(saltHash, signature);
  const whitelistData = await findWhitelistedAccount(address);
  if (whitelistData) {
    return true;
  }
  return false;
};

export const verifyMessageForLayer = async (
  saltHash: string,
  signature: string
): Promise<ICouponModel> => {
  const address = ethers.utils.verifyMessage(saltHash, signature);
  return findExistingCoupon(address);
};
