import ERC721Metadata from "../db/ERC721Metadata";
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
