import IERC721MetadataModel from "../interfaces/Schemas/IERC721MetadataModel";
import {
  createNewMetaDoc,
  findMetadata,
  getAllMetadataDocsSorted,
  createWhitelist,
  findExistingWhitelist,
  updateMetadata,
} from "../repositories/DynamicNFTRepo";
import { ethers } from "ethers";
import IERC721ClaimModel from "../interfaces/Schemas/IERC721ClaimModel";
import crypto from "crypto";
import { IResponseMessage } from "../interfaces/IResponseMessage";
import { getContractERC721 } from "./util/ContractService";
import { generateImage } from "./util/ImageService";
import IEvolveModel from "../interfaces/IEvolveModel";
import { findMetadataERC1155 } from "../repositories/LayerRepo";
import { getAddressFromSignature } from "./util/SignatureVerificationService";

export const getOwnerOfTokenId = async (tokenId: number): Promise<string> => {
  const contract = await getContractERC721();
  return contract.ownerOf(tokenId);
};

export const getTotalSupply = async (): Promise<number> => {
  const contract = await getContractERC721();
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
          await createMetadataModel(i, owner.type);
        }
      }
      return;
    }
  } catch (e) {
    return;
  }
};

export const createMetadataModel = async (
  tokenId: number,
  type: number
): Promise<IERC721MetadataModel> => {
  if (type === 0) {
    const createdDoc: IERC721MetadataModel = await createNewMetaDoc({
      tokenId: tokenId,
      name: "Unknown Titan",
      image: `https://koios-titans.ams3.digitaloceanspaces.com/${process.env.SPACES_ENV}/layers/baseModel_Cryp.png`,
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
        "https://koios-titans.ams3.digitaloceanspaces.com/${process.env.SPACES_ENV}/layers/baseModel_Trade.png",
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
        [salt, process.env.MUMBAY_CONTRACT_ADDRESS, res.address]
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

export const evolveNFT = async (
  model: IEvolveModel,
  saltHash: string,
  signature: string
): Promise<IResponseMessage> => {
  try {
    const address: string = await getAddressFromSignature(saltHash, signature);
    const ownerType = await findExistingWhitelist(address);
    const metadataResponse = await generateImage(
      model.tokens,
      model.model.tokenId,
      ownerType.type
    );

    if (metadataResponse) {
      let newAttributes = [
        ownerType.type === 0
          ? { trait_type: "Background", value: "Blockchain" }
          : { trait_type: "Background", value: "TDFA" },
      ];

      for (const token of model.tokens) {
        const metadataForLayer = await findMetadataERC1155(token);
        if (metadataForLayer) {
          newAttributes.push(metadataForLayer.attributes[0]);
        }
      }
      model.model.attributes = newAttributes;
      model.model.image = `https://koios-titans.ams3.digitaloceanspaces.com/${process.env.SPACES_ENV}/titans/${model.model.tokenId}.png`;
      const updateResponse = await updateMetadata(model.model);
      return {
        success: true,
        message: "Successfully evolved!",
        data: updateResponse,
      };
    } else {
      return {
        success: false,
        error: true,
        message: "Failed to evolve",
      };
    }
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "NFT evolution failed: \n " + e,
    };
  }
};
