import { Contract, providers } from "ethers";
import dynamicNFTContract from "../../json/EvolvingTitan.json";
import titanAchievementsContract from "../../json/TitanAchievements.json";

export const getContractERC721 = async (): Promise<Contract> => {
  const provider = new providers.JsonRpcProvider(
    process.env.DYNAMIC_NFT_PROVIDER
  );

  return new Contract(
    process.env.CONTRACT_DYNAMIC_NFT_ADDRESS,
    dynamicNFTContract.abi,
    provider
  );
};

export const getContractERC1155 = async (): Promise<Contract> => {
  const provider = new providers.JsonRpcProvider(
    process.env.DYNAMIC_NFT_PROVIDER
  );

  return new Contract(
    process.env.CONTRACT_LAYER_NFT_ADDRESS,
    titanAchievementsContract.abi,
    provider
  );
};
