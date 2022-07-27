import Whitelists from "../db/Whitelists";
import ERC721Claims from "../db/ERC721Claims";
import IERC721ClaimModel from "../interfaces/Schemas/IERC721ClaimModel";
import IWhitelistModel from "../interfaces/Schemas/IWhitelistModel";

export const findWhitelistedAccount = async (
  address: string
): Promise<IWhitelistModel> => {
  return Whitelists.findOne({
    address: address,
  });
};
