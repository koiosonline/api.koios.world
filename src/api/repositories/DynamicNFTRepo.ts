import ERC721Claims from "../db/ERC721Claims";
import ERC721Metadata from "../db/ERC721Metadata";
import IERC721ClaimModel from "../interfaces/Schemas/IERC721ClaimModel";
import IERC721MetadataModel from "../interfaces/Schemas/IERC721MetadataModel";

export const createNewMetaDoc = async (
  model: IERC721MetadataModel
): Promise<IERC721MetadataModel> => {
  return ERC721Metadata.create(model);
};

export const getAllMetadataDocsSorted = async (): Promise<
  IERC721MetadataModel[]
> => {
  return ERC721Metadata.find().sort({ tokenId: -1 });
};

export const findMetadata = async (
  token: number
): Promise<IERC721MetadataModel> => {
  return ERC721Metadata.findOne({ tokenId: token }).select({
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

export const findExistingWhitelist = async (
  address: string
): Promise<IERC721ClaimModel> => {
  return ERC721Claims.findOne({
    address: address,
  });
};

export const createWhitelist = async (
  model: IERC721ClaimModel
): Promise<IERC721ClaimModel> => {
  return ERC721Claims.create({
    address: model.address,
    type: model.type,
    dateAchieved: Date.now(),
  });
};

export const deleteAll = async () => {
  return ERC721Metadata.deleteMany();
};
