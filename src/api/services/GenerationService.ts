import axios from "axios";
import { MintersList } from "../interfaces/MintersList";
import { MinterGraphModel } from "../interfaces/MinterGraphModel";
import IClaimModel from "../interfaces/Schemas/IClaimModel";
import {
  createTokenForAccount,
  getAllWhitelistedAccouns,
} from "../repositories/ClaimsRepo";

export const generateJson = async () => {
  try {
    const addressList: IClaimModel[] = await getAllWhitelistedAccouns();
    const mintersNew: MintersList = await getMinterList();
    const minterArray: MinterGraphModel[] = mintersNew.data.users;

    let tokenIds: number[] = createTokenArray(addressList);

    const newFile = generateNewMintList(addressList, minterArray, tokenIds);
    return {
      success: true,
      data: newFile,
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

const createTokenArray = (addressList: IClaimModel[]) => {
  let tokenIds: number[] = Array.from(Array(1000).keys()).map((x) => x + 1);

  for (let item of addressList) {
    for (var i = 0; i < tokenIds.length; i++) {
      if (tokenIds[i] === item.tokenId) {
        tokenIds.splice(i, 1);
      }
    }
  }
  return tokenIds;
};

const generateNewMintList = async (
  newMerkleClaimArray: IClaimModel[],
  minterArray: MinterGraphModel[],
  tokenIds: number[]
) => {
  for (let item of minterArray) {
    const mintable = Math.floor(item.transferedMint / 1000000000000000000 / 10);

    const amountInWhitelist = newMerkleClaimArray.filter(
      (x) => x.claimAddress == item.address && x.whitelist === false
    ).length;

    const amountToAdd = mintable - amountInWhitelist;

    for (let i = 0; i < amountToAdd; i++) {
      const minterModelAddition: IClaimModel = {
        tokenId: tokenIds[(tokenIds.length * Math.random()) | 0],
        claimAddress: item.address,
        whitelist: false,
      };
      for (var l = 0; l < tokenIds.length; l++) {
        if (tokenIds[l] === minterModelAddition.tokenId) {
          tokenIds.splice(l, 1);
        }
      }
      const data = await createTokenForAccount(minterModelAddition);
      console.log("New Token Added");
      console.log(data);
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
