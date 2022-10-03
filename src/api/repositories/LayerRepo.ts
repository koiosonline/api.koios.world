import ERC1155Metadata from "../db/ERC1155Metadata";
import UserClaims from "../db/UserClaims";
import IERC1155MetadataModel from "../interfaces/Schemas/IERC1155MetadataModel";
import IUserClaim from "../interfaces/Schemas/IUserClaim";

export const findMetadataERC1155 = async (
  token: number
): Promise<IERC1155MetadataModel> => {
  return ERC1155Metadata.findOne({ tokenId: token }).select({
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

export const findAll = async (): Promise<IERC1155MetadataModel[]> => {
  return ERC1155Metadata.find().select({
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

export const createUserClaim = async (
  model: IUserClaim
): Promise<IUserClaim> => {
  return UserClaims.create(model);
};

export const findUserClaims = async (
  address: string
): Promise<IUserClaim[]> => {
  return UserClaims.find({ address: address });
};
