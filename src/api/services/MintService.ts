import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import Web3 from "web3";
import { ethers } from "ethers";
import fs from "fs";
import crypto from "crypto";
import { MerkleClaimModel } from "../interfaces/MerkleClaimModel";
import { makeObjectArray } from "../util/MerkleClaimModelMaker";
import { ECDSAProof } from "../interfaces/ECDSAProof";

export const getHexProofForList = async () => {
  try {
    const addressList = JSON.parse(
      fs.readFileSync("src/api/json/addresses.json", "utf8")
    );

    const whitelistAddressesLeaves = addressList.claims.map((x) =>
      Web3.utils.soliditySha3(x.tokenId, x.claimAddress)
    );
    const merkleTree = new MerkleTree(whitelistAddressesLeaves, keccak256, {
      sortPairs: true,
    });

    const whitelistRootHash = merkleTree.getHexRoot();
    console.log("Whitelist Root Hash: " + whitelistRootHash);

    return { rootHash: whitelistRootHash, success: true };
  } catch (e) {
    console.log(e);
    return { proof: [], success: false };
  }
};

export const getProof = async (claimAddress: string, tokenId: number) => {
  try {
    const addressList = JSON.parse(
      fs.readFileSync("src/api/json/addresses.json", "utf8")
    );

    const whitelistAddressesLeaves = addressList.claims.map((x) =>
      Web3.utils.soliditySha3(x.tokenId, x.claimAddress)
    );
    const merkleTree = new MerkleTree(whitelistAddressesLeaves, keccak256, {
      sortPairs: true,
    });

    const whitelistRootHash = merkleTree.getHexRoot();
    console.log("Whitelist Root Hash: " + whitelistRootHash);

    console.log(claimAddress + " : " + tokenId);

    const hashedAddress = Web3.utils.soliditySha3(tokenId, claimAddress);
    const proof = merkleTree.getHexProof(hashedAddress);
    console.log(proof);

    return { proof: proof, success: true };
  } catch (e) {
    console.log(e);
    return { proof: [], success: false };
  }
};

export const getTokensForAccount = async (claimAddress: string) => {
  try {
    const addressList = JSON.parse(
      fs.readFileSync("src/api/json/addresses.json", "utf8")
    );

    const tokensList = addressList.claims.filter(
      (e) => e.claimAddress == claimAddress
    );
    return {
      tokens: tokensList,
      success: true,
    };
  } catch (e) {
    console.log(e);
    return { tokens: [], success: false };
  }
};

export const getSignature = async (claimAddress: string, tokenId: number) => {
  try {
    const wallet = new ethers.Wallet(
      "0x6299a7bce82384f3e452aaadd3cd04c6f54a24e7ecb55aeb18b72723fc5a8ad7" //process.env.PRIV_KEY
    );
    const addressList = JSON.parse(
      fs.readFileSync("src/api/json/addresses.json", "utf8")
    );
    let newMerkleClaimArray: MerkleClaimModel[] = makeObjectArray(addressList);
    const claimModel: MerkleClaimModel = {
      tokenId: tokenId,
      claimAddress: claimAddress,
    };

    if (containsObject(claimModel, newMerkleClaimArray)) {
      const salt = crypto.randomBytes(16).toString("base64");
      const payload = ethers.utils.defaultAbiCoder.encode(
        ["string", "address", "address", "uint256"],
        [
          salt,
          "0x5c4c2811c562060FCE6896D1Fc117d939638De99", //process.env.CONTRACT_ADDRESS
          claimAddress,
          tokenId,
        ]
      );
      let payloadHash = ethers.utils.keccak256(payload);
      const token: string = await wallet.signMessage(
        ethers.utils.arrayify(payloadHash)
      );
      const proof: ECDSAProof = {
        tokenId: tokenId,
        salt: salt,
        token: token,
      };
      return {
        proof: proof,
        invalid: false,
        success: true,
      };
    }
    return {
      proof: [],
      invalid: true,
      success: false,
    };
  } catch (e) {
    console.log(e);
    return { proof: [], invalid: true, success: false };
  }
};

const containsObject = (obj: MerkleClaimModel, list: MerkleClaimModel[]) => {
  var i;
  for (i = 0; i < list.length; i++) {
    if (
      list[i].claimAddress === obj.claimAddress &&
      list[i].tokenId === obj.tokenId
    ) {
      return true;
    }
  }

  return false;
};
