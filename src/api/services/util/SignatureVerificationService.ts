import { ethers } from "ethers";
import { findWhitelistedAccount } from "../../repositories/WhitelistRepo";
import { findExistingCoupon } from "../../repositories/CouponRepo";
import { alchemyAPI } from "../../services/util/AlchemyService";
import ICouponModel from "../../interfaces/Schemas/ICouponModel";

export const verifyMessage = async (
  saltHash: string,
  signature: string
): Promise<boolean> => {
  const address = ethers.utils.verifyMessage(saltHash, signature);
  const whitelistData = await findWhitelistedAccount(address);
  if (whitelistData) {
    return true;
  }
  return false;
};

export const verifyMessageForLayer = async (
  saltHash: string,
  signature: string
): Promise<ICouponModel> => {
  const address = ethers.utils.verifyMessage(saltHash, signature);
  return findExistingCoupon(address);
};

export const verifyMessageForOwnedLayers = async (
  saltHash: string,
  signature: string,
  tokens: number[]
): Promise<boolean> => {
  const address = ethers.utils.verifyMessage(saltHash, signature);
  const ownedNFTs: any = await alchemyAPI.nft.getNftsForOwner(address, {
    contractAddresses: [`${process.env.CONTRACT_LAYER_NFT_ADDRESS}`],
  });
  const tokenIds: number[] = ownedNFTs.ownedNfts.map((nft: any) =>
    parseInt(nft.tokenId)
  );
  const ownedArray: boolean[] = [];

  const filteredTokens = tokens.filter((x) => x !== 0);
  for (let item of filteredTokens) {
    if (tokenIds.includes(item)) {
      ownedArray.push(true);
    } else {
      ownedArray.push(false);
    }
  }

  if (ownedArray.includes(false)) {
    return false;
  }
  return true;
};

export const verifyDynamicNFTOwnership = async (
  saltHash: string,
  signature: string,
  tokenId: number
): Promise<boolean> => {
  const address = ethers.utils.verifyMessage(saltHash, signature);
  const ownedNFT: any = await alchemyAPI.nft.getNftsForOwner(address, {
    contractAddresses: [`${process.env.CONTRACT_DYNAMIC_NFT_ADDRESS}`],
  });

  if (
    ownedNFT.ownedNfts.length > 0 &&
    parseInt(ownedNFT.ownedNfts[0].tokenId) === tokenId
  ) {
    return true;
  }
  return false;
};

export const getAddressFromSignature = async (
  saltHash: string,
  signature: string
) => {
  return ethers.utils.verifyMessage(saltHash, signature);
};
