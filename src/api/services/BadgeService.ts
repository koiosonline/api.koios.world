import { IResponseMessage } from "../interfaces/IResponseMessage";
import IBadgeRegisterModel from "../interfaces/Schemas/IBadgeRegisterModel";
import IUserClaim from "../interfaces/Schemas/IUserClaim";
import {
  createBadgeClaim,
  findBadges,
  findExistingBadge,
} from "../repositories/UserClaimrepo";
import generateSignature from "./util/SignatureGenerationService";

export const findBadgesForAccount = async (
  address: string
): Promise<IResponseMessage> => {
  try {
    const res = await findBadges(
      address,
      process.env.CONTRACT_BADGES_NFT_ADDRESS
    );
    if (res) {
      return {
        success: true,
        message: "Address badges found successfully",
        data: res,
      };
    }
    return {
      success: false,
      error: true,
      message: "No badges found",
      data: res,
    };
  } catch (e) {
    return {
      success: false,
      message: "Error finding badges",
      data: e,
    };
  }
};

export const uploadMultipleBadges = async (
  badges: IBadgeRegisterModel[]
): Promise<IResponseMessage> => {
  try {
    let resData: IUserClaim[] = [];

    for (const badge of badges) {
      const alreadyExists = await findExistingBadge(
        badge.address,
        badge.type,
        process.env.CONTRACT_BADGES_NFT_ADDRESS
      );
      if (!alreadyExists) {
        const signatureData = await generateSignature(
          badge.address,
          badge.type,
          process.env.CONTRACT_BADGES_NFT_ADDRESS
        );

        const createResponse = await createBadgeClaim({
          salt: signatureData.saltHash,
          proof: signatureData.signature,
          tokenId: signatureData.tokenId,
          address: badge.address,
          dateAdded: new Date(),
          contractAddress: process.env.CONTRACT_BADGES_NFT_ADDRESS,
        });

        resData.push(createResponse);
      }
    }
    return {
      success: true,
      message: "Badges added successfully",
      data: resData,
    };
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "Badges creation failed: \n " + e,
    };
  }
};

export const uploadSingleBadge = async (
  badge: IBadgeRegisterModel
): Promise<IResponseMessage> => {
  try {
    let resData: IUserClaim;

    const alreadyExists = await findExistingBadge(
      badge.address,
      badge.type,
      process.env.CONTRACT_BADGES_NFT_ADDRESS
    );
    if (!alreadyExists) {
      const signatureData = await generateSignature(
        badge.address,
        badge.type,
        process.env.CONTRACT_BADGES_NFT_ADDRESS
      );

      const createResponse = await createBadgeClaim({
        salt: signatureData.saltHash,
        proof: signatureData.signature,
        tokenId: signatureData.tokenId,
        address: badge.address,
        dateAdded: new Date(),
        contractAddress: process.env.CONTRACT_BADGES_NFT_ADDRESS,
      });

      resData = createResponse;
    }

    return {
      success: true,
      message: "Badge added successfully",
      data: resData,
    };
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "Badges creation failed: \n " + e,
    };
  }
};
