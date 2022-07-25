import { ethers } from "ethers";
import crypto from "crypto";
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

export const findWhitelistedAddress = async (
  address: string
): Promise<IResponseMessage> => {
  try {
    const res = await findExistingWhitelist(address);
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
      message: "Address lookup failed: \n " + e,
    };
  }
};

export const getSignatureForAddress = async (
  address: string
): Promise<IResponseMessage> => {
  try {
    const res = await findExistingWhitelist(address);
    if (res) {
      const wallet = new ethers.Wallet(process.env.SIGNER_KEY);
      const salt = crypto.randomBytes(16).toString("base64");
      const payload = ethers.utils.defaultAbiCoder.encode(
        ["string", "address", "address"],
        [salt, process.env.MUMBAY_CONTRACT_ADDRESS, address]
      );
      let payloadHash = ethers.utils.keccak256(payload);
      const token: string = await wallet.signMessage(
        ethers.utils.arrayify(payloadHash)
      );
      return {
        success: true,
        message: "Address is whitelisted",
        data: {
          salt,
          token,
        },
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
      message: "Address lookup failed: \n " + e,
    };
  }
};
