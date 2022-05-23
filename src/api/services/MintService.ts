import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import Web3 from "web3";
import fs from "fs";

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
