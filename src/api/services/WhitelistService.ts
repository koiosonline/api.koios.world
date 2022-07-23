import { IResponseMessage } from "../interfaces/IResponseMessage";
import IERC721ClaimModel from "../interfaces/Schemas/IERC721ClaimModel";
import {
  createWhitelist,
  findExistingWhitelist,
  findWhitelistedAccount,
} from "../repositories/WhitelistRepo";

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

export const uploadSingle = async (
  model: IERC721ClaimModel
): Promise<IResponseMessage> => {
  try {
    const alreadyExists = await findExistingWhitelist(model.address);
    if (alreadyExists) {
      return {
        success: false,
        error: true,
        message: "Address already whitelisted",
        data: model,
      };
    }
    const resCreate = await createWhitelist(model);
    return {
      success: true,
      message: "Address whitelisted successfully",
      data: resCreate,
    };
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "Whitelist creation/addition failed: \n " + e,
    };
  }
};

export const uploadMultiple = async (
  models: IERC721ClaimModel[]
): Promise<IResponseMessage> => {
  try {
    let resData: IERC721ClaimModel[] = [];

    for (const model of models) {
      const alreadyExists = await findExistingWhitelist(model.address);
      if (!alreadyExists) {
        const resCreate = await createWhitelist(model);
        resData.push(resCreate);
      }
    }
    return {
      success: true,
      message: "Addresses whitelisted successfully",
      data: resData,
    };
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "Whitelists creation/addition failed: \n " + e,
    };
  }
};
