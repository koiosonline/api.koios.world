import IBadgeRegisterModel from "../interfaces/Schemas/IBadgeRegisterModel";
import BadgesRegister from "../db/BadgeRegister";

export const createBadge = async (
  badgeModel: IBadgeRegisterModel
): Promise<IBadgeRegisterModel> => {
  return BadgesRegister.create(badgeModel);
};

export const findBadges = async (
  address: string
): Promise<IBadgeRegisterModel[]> => {
  return BadgesRegister.find({
    address: address,
  });
};

export const findExistingBadge = async (
  address: string,
  type: number
): Promise<IBadgeRegisterModel> => {
  return BadgesRegister.findOne({
    address: address,
    type: type,
  });
};
