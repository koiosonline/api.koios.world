import { MerkleClaimModel } from "../interfaces/MerkleClaimModel";

export const makeObjectArray = (addressList) => {
  let newMerkleClaimArray: MerkleClaimModel[] = [];

  for (let item of addressList.claims) {
    const newItem: MerkleClaimModel = {
      tokenId: item.tokenId,
      claimAddress: item.claimAddress,
      whitelist: item.whitelist,
    };
    newMerkleClaimArray.push(newItem);
  }
  return newMerkleClaimArray;
};
