import IClaimModel from "../interfaces/Schemas/IClaimModel";

export const makeObjectArray = (addressList) => {
  let newMerkleClaimArray: IClaimModel[] = [];

  for (let item of addressList.claims) {
    const newItem: IClaimModel = {
      tokenId: item.tokenId,
      claimAddress: item.claimAddress,
      whitelist: item.whitelist,
    };
    newMerkleClaimArray.push(newItem);
  }
  return newMerkleClaimArray;
};
