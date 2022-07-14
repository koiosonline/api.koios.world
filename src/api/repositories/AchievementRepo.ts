import Achievements from "../db/Achievements";
import AchievementTypes from "../db/AchievementTypes";
import IAchievementModel from "../interfaces/Schemas/IAchievementModel";
import IAchievementType from "../interfaces/Schemas/IAchievementType";

export const createAchievementForAccount = async (
  achievement: IAchievementModel
): Promise<IAchievementModel> => {
  return Achievements.create(achievement);
};

export const createManyAchievementsForAccounts = async (
  achievements: IAchievementModel[]
): Promise<IAchievementModel[]> => {
  return Achievements.create(achievements);
};

export const findAllAchievementTypes = async (): Promise<
  IAchievementType[]
> => {
  return AchievementTypes.find();
};

export const findOneAchievement = async (
  address: string,
  type: number,
  name: string,
  tokenId: number
): Promise<IAchievementModel> => {
  return Achievements.findOne({
    address: address,
    type: type,
    name: name,
    tokenId: tokenId,
  });
};
