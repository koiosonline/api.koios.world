import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import Web3 from "web3";
import whitelistAddresses from "./addresses.json";

const merkleClaimHandler = async ({ claimAddress, tokenId }) => {
  const whitelistAddressesLeaves = whitelistAddresses.claims.map((x) =>
    Web3.utils.soliditySha3(x.tokenID, x.owner)
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

  return { proof: proof };
};

export default merkleClaimHandler;
