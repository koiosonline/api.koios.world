import { IResponseMessage } from "../interfaces/IResponseMessage";
import IBadgeRegisterModel from "../interfaces/Schemas/IBadgeRegisterModel";
import {
  createBadge,
  findBadges,
  findExistingBadge,
} from "../repositories/BadgeRepo";

export const findBadgesForAccount = async (
  address: string
): Promise<IResponseMessage> => {
  try {
    const res = await findBadges(address);
    if (res) {
      return {
        success: true,
        message: "Address badges found successfully",
        data: res,
      };
    }
    return {
      success: false,
      error: true,
      message: "No badges found",
      data: res,
    };
  } catch (e) {
    return {
      success: false,
      message: "Error finding badges",
      data: e,
    };
  }
};

export const uploadMultipleBadges = async (
  badges: IBadgeRegisterModel[]
): Promise<IResponseMessage> => {
  try {
    let resData: IBadgeRegisterModel[] = [];

    for (const badge of badges) {
      const alreadyExists = await findExistingBadge(badge.address, badge.type);
      if (!alreadyExists) {
        const resCreate = await createBadge(badge);
        resData.push(resCreate);
      }
    }
    return {
      success: true,
      message: "Badges added successfully",
      data: resData,
    };
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "Badges creation failed: \n " + e,
    };
  }
};

export const uploadSingleBadge = async (
  badge: IBadgeRegisterModel
): Promise<IResponseMessage> => {
  try {
    let resData: IBadgeRegisterModel;

    const alreadyExists = await findExistingBadge(badge.address, badge.type);
    if (!alreadyExists) {
      const resCreate = await createBadge(badge);
      resData = resCreate;
    }

    return {
      success: true,
      message: "Badge added successfully",
      data: resData,
    };
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "Badges creation failed: \n " + e,
    };
  }
};
