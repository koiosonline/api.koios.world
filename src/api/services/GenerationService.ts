import fs from "fs";
import { MinterModel } from "../interfaces/MinterModel";
import { MerkleClaimModel } from "../interfaces/MerkleClaimModel";

export const generateJson = async () => {
  try {
    const addressList = JSON.parse(
      fs.readFileSync("src/api/json/addresses.json", "utf8")
    );
    const mintersFromFile = JSON.parse(
      fs.readFileSync("src/api/json/minters.json", "utf8")
    );
    const minterArray: MinterModel[] = mintersFromFile.minters;

    let newMerkleClaimArray: MerkleClaimModel[] = makeObjectArray(addressList);
    let tokenIds: number[] = createTokenArray(addressList);

    const newFile = generateNewMintList(
      addressList,
      newMerkleClaimArray,
      minterArray,
      tokenIds
    );

    const newAddressesFile = {
      claims: newFile,
    };
    fs.writeFileSync(
      "src/api/json/addresses.json",
      JSON.stringify(newAddressesFile)
    );
    return {
      success: true,
      data: JSON.parse(fs.readFileSync("src/api/json/addresses.json", "utf8")),
    };
  } catch (e) {
    console.log(e);
    return { success: false };
  }
};

const makeObjectArray = (addressList) => {
  let newMerkleClaimArray: MerkleClaimModel[] = [];

  for (let item of addressList.claims) {
    const newItem: MerkleClaimModel = {
      tokenId: item.tokenId,
      claimAddress: item.claimAddress,
    };
    newMerkleClaimArray.push(newItem);
  }
  return newMerkleClaimArray;
};

const createTokenArray = (addressList) => {
  let tokenIds: number[] = Array.from(Array(100).keys()).map((x) => x + 1);

  for (let item of addressList.claims) {
    for (var i = 0; i < tokenIds.length; i++) {
      if (tokenIds[i] === item.tokenId) {
        tokenIds.splice(i, 1);
      }
    }
  }
  return tokenIds;
};

const generateNewMintList = (
  addressList: any,
  newMerkleClaimArray: MerkleClaimModel[],
  minterArray: MinterModel[],
  tokenIds: number[]
) => {
  for (let item of minterArray) {
    const mintable = Math.floor(item.amount / 10);

    const amountInWhitelist = addressList.claims.filter(
      (x) => x.claimAddress == item.minterAddress
    );
    const amountInWhitelistForAddress = amountInWhitelist.length;

    const amountToAdd = mintable - amountInWhitelistForAddress;

    for (let i = 0; i < amountToAdd; i++) {
      const minterModelAddition: MerkleClaimModel = {
        tokenId: tokenIds[(tokenIds.length * Math.random()) | 0],
        claimAddress: item.minterAddress,
      };
      for (var l = 0; l < tokenIds.length; l++) {
        if (tokenIds[l] === minterModelAddition.tokenId) {
          tokenIds.splice(l, 1);
        }
      }
      newMerkleClaimArray.push(minterModelAddition);
    }
  }
  return newMerkleClaimArray;
};

export const checkPassword = (password: string) => {
  if (password == process.env.GENERATION_PASSWORD) {
    return true;
  }
  return false;
};
