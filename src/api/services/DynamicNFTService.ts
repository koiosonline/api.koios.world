import IERC721MetadataModel from "../interfaces/Schemas/IERC721MetadataModel";
import {
  createNewMetaDoc,
  findMetadata,
  getAllMetadataDocsSorted,
  createWhitelist,
  findExistingWhitelist,
} from "../repositories/DynamicNFTRepo";
import { Contract, providers, ethers } from "ethers";
import dynamicNFTContract from "../json/EvolvingTitan.json";
import IERC721ClaimModel from "../interfaces/Schemas/IERC721ClaimModel";
import crypto from "crypto";
import { IResponseMessage } from "../interfaces/IResponseMessage";

export const getContract = async (): Promise<Contract> => {
  const provider = new providers.JsonRpcProvider(
    process.env.DYNAMIC_NFT_PROVIDER
  );

  return new Contract(
    process.env.CONTRACT_DYNAMIC_NFT_ADDRESS,
    dynamicNFTContract.abi,
    provider
  );
};

export const getOwnerOfTokenId = async (tokenId: number): Promise<string> => {
  const contract = await getContract();
  return contract.ownerOf(tokenId);
};

export const getTotalSupply = async (): Promise<number> => {
  const contract = await getContract();
  return contract.totalSupply();
};

export const watchDynamicNFT = async () => {
  try {
    const supply = await getTotalSupply();
    const resData: IERC721MetadataModel[] = await getAllMetadataDocsSorted();
    if (resData.length === 0) {
      const ownerOf = await getOwnerOfTokenId(1);
      const owner: IERC721ClaimModel = await findExistingWhitelist(ownerOf);
      await createMetadataModel(1, owner.type);
      return;
    } else {
      const latestTokenId = resData[0].tokenId;

      for (let i = latestTokenId + 1; i <= supply; i++) {
        const metadata = await findMetadata(i);
        if (!metadata) {
          const ownerOf = await getOwnerOfTokenId(i);
          const owner: IERC721ClaimModel = await findExistingWhitelist(ownerOf);
          const returnedModel = await createMetadataModel(i, owner.type);
          console.log(
            "Created new Titan: " + returnedModel.tokenId + " " + owner.address
          );
        }
      }
      return;
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

export const uploadSingle = async (
  model: IERC721ClaimModel
): Promise<IResponseMessage> => {
  try {
    const alreadyExists = await findExistingWhitelist(model.address);
    if (alreadyExists) {
      return {
        success: false,
        error: true,
        message: "Address already whitelisted",
        data: model,
      };
    }
    const resCreate = await createWhitelist(model);
    return {
      success: true,
      message: "Address whitelisted successfully",
      data: resCreate,
    };
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "Whitelist creation/addition failed: \n " + e,
    };
  }
};

export const uploadMultiple = async (
  models: IERC721ClaimModel[]
): Promise<IResponseMessage> => {
  try {
    let resData: IERC721ClaimModel[] = [];

    for (const model of models) {
      const alreadyExists = await findExistingWhitelist(model.address);
      if (!alreadyExists) {
        const resCreate = await createWhitelist(model);
        resData.push(resCreate);
      }
    }
    return {
      success: true,
      message: "Addresses whitelisted successfully",
      data: resData,
    };
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "Whitelists creation/addition failed: \n " + e,
    };
  }
};

export const findWhitelistedAddress = async (
  address: string
): Promise<IResponseMessage> => {
  try {
    const res = await findExistingWhitelist(address);
    if (res) {
      return {
        success: true,
        message: "Address is whitelisted",
        data: res,
      };
    }
    return {
      success: false,
      error: true,
      message: "Address not whitelisted",
      data: res,
    };
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "Address lookup failed: \n " + e,
    };
  }
};

export const getSignatureForAddress = async (
  address: string
): Promise<IResponseMessage> => {
  try {
    const res = await findExistingWhitelist(address);
    if (res) {
      const wallet = new ethers.Wallet(process.env.SIGNER_KEY);
      const salt = crypto.randomBytes(16).toString("base64");
      const payload = ethers.utils.defaultAbiCoder.encode(
        ["string", "address", "address"],
        [salt, process.env.MUMBAY_CONTRACT_ADDRESS, address]
      );
      let payloadHash = ethers.utils.keccak256(payload);
      const token: string = await wallet.signMessage(
        ethers.utils.arrayify(payloadHash)
      );
      return {
        success: true,
        message: "Address is whitelisted",
        data: {
          salt,
          token,
        },
      };
    }
    return {
      success: false,
      error: true,
      message: "Address not whitelisted",
      data: res,
    };
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "Address lookup failed: \n " + e,
    };
  }
};
