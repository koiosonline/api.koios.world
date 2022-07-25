import ERC721Metadata from "../db/ERC721Metadata";
import IERC721MetadataModel from "../interfaces/Schemas/IERC721MetadataModel";

export const createNewMetaDoc = async (
  model: IERC721MetadataModel
): Promise<IERC721MetadataModel> => {
  return ERC721Metadata.create(model);
};
