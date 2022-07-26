import IERC721MetadataModel from "../interfaces/Schemas/IERC721MetadataModel";
import {
  createNewMetaDoc,
  findMetadata,
  getAllMetadataDocsSorted,
} from "../repositories/DynamicNFTRepo";
import { Contract, providers } from "ethers";
import dynamicNFTContract from "../json/EvolvingTitan.json";
import { findExistingWhitelist } from "../repositories/WhitelistRepo";
import IERC721ClaimModel from "../interfaces/Schemas/IERC721ClaimModel";

export const watchDynamicNFT = async () => {
  try {
    const provider = new providers.JsonRpcProvider(
      process.env.DYNAMIC_NFT_PROVIDER
    );
    const contract = new Contract(
      process.env.CONTRACT_DYNAMIC_NFT_ADDRESS,
      dynamicNFTContract.abi,
      provider
    );
    const supply = await contract.totalSupply();
    const resData: IERC721MetadataModel[] = await getAllMetadataDocsSorted();
    if (resData.length === 0) {
      const ownerOf = await contract.ownerOf(1);
      const owner: IERC721ClaimModel = await findExistingWhitelist(ownerOf);
      await createMetadataModel(1, owner.type);
      createMetadataModel(1, owner.type);
      return;
    } else {
      const latestTokenId = resData[0].tokenId;

      for (let i = latestTokenId + 1; i <= supply; i++) {
        const metadata = await findMetadata(i);
        if (!metadata) {
          const ownerOf = await contract.ownerOf(i);
          const owner: IERC721ClaimModel = await findExistingWhitelist(ownerOf);
          if (owner.type === 0) {
            const returnedModel = await createMetadataModel(i, owner.type);
            console.log(
              "Created new Titan: " +
                returnedModel.tokenId +
                " " +
                owner.address
            );
          } else {
            await createMetadataModel(i, owner.type);
            createMetadataModel(i, owner.type);
          }
        }
      }
    }
  } catch (e) {
    console.log("tried to duplicate a key, just ignore it and continue");
    throw new Error(e);
  }
};

const createMetadataModel = async (
  tokenId: number,
  type: number
): Promise<IERC721MetadataModel> => {
  if (type === 0) {
    const createdDoc: IERC721MetadataModel = await createNewMetaDoc({
      tokenId: tokenId,
      name: "Unknown Titan",
      image:
        "https://koios-titans.ams3.digitaloceanspaces.com/titans/images/baseModel_Cryp.png",
      description: "This is a fresh Titan with no back story.",
      external_url: "https://nfts.koios.world",
      attributes: [{ trait_type: "Background", value: "Blockchain" }],
    });
    return createdDoc;
  } else {
    const createdDoc: IERC721MetadataModel = await createNewMetaDoc({
      tokenId: tokenId,
      name: "Unknown Titan",
      image:
        "https://koios-titans.ams3.digitaloceanspaces.com/titans/images/baseModel_Trade.png",
      description: "This is a fresh Titan with no back story.",
      external_url: "https://nfts.koios.world",
      attributes: [{ trait_type: "Background", value: "TDFA" }],
    });
    return createdDoc;
  }
};
