import Whitelists from "../db/Whitelists";
import IWhitelistModel from "../interfaces/Schemas/IWhitelistModel";

export const findWhitelistedAccount = async (
  address: string
): Promise<IWhitelistModel> => {
  return Whitelists.findOne({
    address: address,
  });
};
