import { Request, Response } from "express";
import { MerkleClaimModel } from "../interfaces/MerkleClaimModel";
import {
  getHexProofForList,
  getProof,
  getTokensForAccount,
} from "../services/MintService";

export const post = async (req: Request, res: Response) => {
  try {
    const merkleClaim: MerkleClaimModel = req.body;
    if (merkleClaim.claimAddress && merkleClaim.tokenId) {
      const proof = await getProof(
        merkleClaim.claimAddress,
        merkleClaim.tokenId
      );
      if (proof.success) {
        res.send(proof);
        return;
      }
    }
    res.status(400).send("Bad Request");
    return;
  } catch (err) {
    console.log(err);
    res.status(400).send("Bad Request");
  }
};

export const get = async (req: Request, res: Response) => {
  try {
    const claimAddress: string = req.body.claimAddress;
    if (claimAddress) {
      const tokens = await getTokensForAccount(claimAddress);
      if (tokens.success) {
        res.send(tokens);
        return;
      }
    }
    res.status(404).send("Bad Request");
    return;
  } catch (err) {
    console.log(err);
    res.status(404).send("Bad Request");
  }
};

export const rootHash = async (req: Request, res: Response) => {
  try {
    const root = await getHexProofForList();
    if (root.success) {
      res.send(root);
      return;
    }
    res.status(500).send("Internal Server Error");
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};
