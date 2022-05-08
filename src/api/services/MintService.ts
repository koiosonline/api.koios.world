import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import Web3 from "web3";
import whitelistAddresses from "../json/addresses.json";

export const getProof = async (claimAddress: string, tokenId: number) => {
  try {
    const whitelistAddressesLeaves = whitelistAddresses.claims.map((x) =>
      Web3.utils.soliditySha3(x.tokenID, x.claimAddress)
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
