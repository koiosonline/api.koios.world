import { IResponseMessage } from "../interfaces/IResponseMessage";
import { findWhitelistedAccount } from "../repositories/WhitelistRepo";

export const findAddress = async (
  address: string
): Promise<IResponseMessage> => {
  try {
    const res = await findWhitelistedAccount(address);
    if (res) {
      return {
        success: true,
        message: "Address is whitelisted",
        data: res,
      };
    }
    return {
      success: false,
      error: true,
      message: "Address not whitelisted",
      data: res,
    };
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "Achievement types fetch failed: \n " + e,
    };
  }
};
