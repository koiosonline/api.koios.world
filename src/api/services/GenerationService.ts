import fs from "fs";
import { MerkleClaimModel } from "../interfaces/MerkleClaimModel";
import { makeObjectArray } from "../util/MerkleClaimModelMaker";
import axios from "axios";
import { MintersList } from "../interfaces/MintersList";
import { MinterGraphModel } from "../interfaces/MinterGraphModel";

export const generateJson = async () => {
  try {
    const addressList = JSON.parse(
      fs.readFileSync("src/api/json/addresses.json", "utf8")
    );

    const mintersNew: MintersList = await getMinterList();
    const minterArray: MinterGraphModel[] = mintersNew.data.users;

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

const getMinterList = async () => {
  const query = `
  {
    users(orderBy: transferedMint, orderDirection: desc, where: {transferedMint_gt: 0}) {
      address
      transferedMint
    }
  }
          `;
  const URL = process.env.SUBGRAPH_URL;
  const body = JSON.stringify({ query: query });
  const test = await axios.post(URL, body);
  return test.data;
};

const createTokenArray = (addressList) => {
  let tokenIds: number[] = Array.from(Array(1000).keys()).map((x) => x + 1);

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
  minterArray: MinterGraphModel[],
  tokenIds: number[]
) => {
  for (let item of minterArray) {
    const mintable = Math.floor(item.transferedMint / 1000000000000000000 / 10);

    const amountInWhitelist = addressList.claims.filter(
      (x) => x.claimAddress == item.address
    );
    const amountInWhitelistForAddress = amountInWhitelist.length;

    const amountToAdd = mintable - amountInWhitelistForAddress;

    for (let i = 0; i < amountToAdd; i++) {
      const minterModelAddition: MerkleClaimModel = {
        tokenId: tokenIds[(tokenIds.length * Math.random()) | 0],
        claimAddress: item.address,
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
