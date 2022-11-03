import IBadgeRegisterModel from "../interfaces/Schemas/IBadgeRegisterModel";
import BadgesRegister from "../db/BadgeRegister";
import IBadgesMetadataModel from "../interfaces/Schemas/IBadgesMetadataModel";
import BadgesMetadata from "../db/BadgesMetadata";

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

export const findAllBadges = async (): Promise<IBadgesMetadataModel[]> => {
  return BadgesMetadata.find().select({
    _id: 0,
    tokenId: 1,
    name: 1,
    image: 1,
    description: 1,
    external_url: 1,
    "attributes.trait_type": 1,
    "attributes.value": 1,
  });
};
