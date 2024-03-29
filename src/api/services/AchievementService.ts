import { IResponseMessage } from "../interfaces/IResponseMessage";
import IAchievementModel from "../interfaces/Schemas/IAchievementModel";
import IWhitelistModel from "../interfaces/Schemas/IWhitelistModel";
import {
  createAchievementForAccount,
  createManyAchievementsForAccounts,
  findAllAchievementTypes,
  findOneAchievement,
} from "../repositories/AchievementRepo";
import { findWhitelistedAccount } from "../repositories/WhitelistRepo";

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
    let achievementsFiltered: IAchievementModel[] = [];
    for (let achievement of achievements) {
      const alreadyExists = await findOneAchievement(
        achievement.address,
        achievement.type,
        achievement.name,
        achievement.tokenId
      );
      if (!alreadyExists) {
        achievementsFiltered.push(achievement);
      }
    }
    const res = await createManyAchievementsForAccounts(achievementsFiltered);

    return {
      success: true,
      message: "Achievements created successfully",
      data: res,
    };
  } catch (e) {
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
    return {
      success: false,
      error: true,
      message: "Achievement types fetch failed: \n " + e,
    };
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
    return {
      success: false,
      error: true,
      message: "Achievement check failed: \n " + e,
    };
  }
};
