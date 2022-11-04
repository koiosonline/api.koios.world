import { ethers } from "ethers";
import ILayerClaimModel from "../../interfaces/ILayerClaimModel";
import crypto from "crypto";

export default async function generateSignature(
  address: string,
  tokenId: number,
  contractAddress: string
): Promise<ILayerClaimModel> {
  try {
    const wallet = new ethers.Wallet(process.env.SIGNER_KEY);
    const salt = crypto.randomBytes(16).toString("base64");
    const payload = ethers.utils.defaultAbiCoder.encode(
      ["string", "address", "address", "uint256"],
      [salt, contractAddress, address, tokenId]
    );
    let payloadHash = ethers.utils.keccak256(payload);
    const signature: string = await wallet.signMessage(
      ethers.utils.arrayify(payloadHash)
    );
    return {
      saltHash: salt,
      signature: signature,
      tokenId: tokenId,
    };
  } catch (e) {
    return;
  }
}
