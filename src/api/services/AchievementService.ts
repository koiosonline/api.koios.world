import { IResponseMessage } from "../interfaces/IResponseMessage";
import IAchievementModel from "../interfaces/Schemas/IAchievementModel";
import IWhitelistModel from "../interfaces/Schemas/IWhitelistModel";
import {
  createAchievementForAccount,
  createManyAchievementsForAccounts,
  findAllAchievementTypes,
  findOneAchievement,
  findWhitelistedAccount,
} from "../repositories/AchievementRepo";

export const uploadSingle = async (
  achievement: IAchievementModel
): Promise<IResponseMessage> => {
  try {
    const alreadyExists = await findOneAchievement(
      achievement.address,
      achievement.type,
      achievement.name,
      achievement.tokenId
    );
    if (alreadyExists) {
      return {
        success: false,
        error: true,
        message: "Achievement already exists",
      };
    }
    const res = await createAchievementForAccount(achievement);
    return {
      success: true,
      message: "Achievement created successfully",
      data: res,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: true,
      message: "Achievement creation failed: \n " + e,
    };
  }
};

export const uploadMultiple = async (
  achievements: IAchievementModel[]
): Promise<IResponseMessage> => {
  try {
    const res = await createManyAchievementsForAccounts(achievements);
    return {
      success: true,
      message: "Achievements created successfully",
      data: res,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: true,
      message: "Achievements creation failed: \n " + e,
    };
  }
};

export const getAllAchievementTypes = async (): Promise<IResponseMessage> => {
  try {
    const res = await findAllAchievementTypes();
    return {
      success: true,
      message: "Achievement types found successfully",
      data: res,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: true,
      message: "Achievement types fetch failed: \n " + e,
    };
  }
};

export const checkWhitelisted = async (
  address: string
): Promise<IResponseMessage> => {
  try {
    const whitelistedModel: IWhitelistModel = await findWhitelistedAccount(
      address
    );
    if (whitelistedModel) {
      return {
        success: true,
        message: "Account is whitelisted",
        data: whitelistedModel,
      };
    }
    return { success: false, message: "Account is not whitelisted" };
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const checkExistingAchievementForAccount = async (
  address: string,
  type: number,
  name: string,
  tokenId: number
): Promise<IResponseMessage> => {
  try {
    const achievementModel: IAchievementModel = await findOneAchievement(
      address,
      type,
      name,
      tokenId
    );
    if (achievementModel) {
      return {
        success: true,
        error: true,
        message: "Achievement already exists for user: " + address,
        data: achievementModel,
      };
    }
    return { success: true, message: "Achievement does not exist" };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: true,
      message: "Achievement check failed: \n " + e,
    };
  }
};
