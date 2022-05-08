import { Request, Response } from "express";
import { MerkleClaimModel } from "../interfaces/MerkleClaimModel";
import { getProof } from "../services/MintService";

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
