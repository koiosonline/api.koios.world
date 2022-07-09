import IAchievementModel from "../interfaces/Schemas/IAchievementModel";
import IWhitelistModel from "../interfaces/Schemas/IWhitelistModel";
import {
  createAchievementForAccount,
  createManyAchievementsForAccounts,
  findAllAchievementTypes,
  findOneAchievement,
  findWhitelistedAccount,
} from "../repositories/AchievementRepo";

export const uploadSingle = async (achievement: IAchievementModel) => {
  try {
    const res = await createAchievementForAccount(achievement);
    return {
      success: true,
      instance: res,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      instance: [],
    };
  }
};

export const uploadMultiple = async (achievements: IAchievementModel[]) => {
  try {
    const res = await createManyAchievementsForAccounts(achievements);
    return {
      success: true,
      instance: res,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      instance: [],
    };
  }
};

export const getAllAchievementTypes = async () => {
  try {
    return await findAllAchievementTypes();
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const checkWhitelisted = async (address: string) => {
  try {
    const whitelistedModel: IWhitelistModel = await findWhitelistedAccount(
      address
    );
    if (whitelistedModel) {
      return { found: true };
    }
    return { found: false };
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const checkExistingAchievementForAccount = async (
  address,
  type,
  name,
  tokenId
) => {
  try {
    const achievementModel: IAchievementModel = await findOneAchievement(
      address,
      type,
      name,
      tokenId
    );
    if (achievementModel) {
      return { found: true };
    }
    return { found: false };
  } catch (e) {
    console.log(e);
    return e;
  }
};
