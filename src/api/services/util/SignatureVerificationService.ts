import { ethers } from "ethers";
import { findWhitelistedAccount } from "../../repositories/WhitelistRepo";

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
