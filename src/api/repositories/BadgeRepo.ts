import IBadgesMetadataModel from "../interfaces/Schemas/IBadgesMetadataModel";
import BadgesMetadata from "../db/BadgesMetadata";

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
