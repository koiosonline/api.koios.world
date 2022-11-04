import { IResponseMessage } from "../interfaces/IResponseMessage";
import { removeCouponForAddress } from "./CouponService";
import { createUserClaim } from "../repositories/LayerRepo";
import generateSignature from "./util/SignatureGenerationService";

export const getSignature = async (
  address: string,
  tokenId: number
): Promise<IResponseMessage> => {
  const removeCoupon: IResponseMessage = await removeCouponForAddress(address);
  if (removeCoupon.success) {
    const signatureData = await generateSignature(
      address,
      tokenId,
      process.env.CONTRACT_LAYER_NFT_ADDRESS
    );

    const createResponse = await createUserClaim({
      salt: signatureData.saltHash,
      proof: signatureData.signature,
      tokenId: tokenId,
      address: address,
      dateAdded: new Date(),
      contractAddress: process.env.CONTRACT_LAYER_NFT_ADDRESS,
    });
    if (createResponse) {
      return {
        success: true,
        message: "Successfully retrieved signature",
        data: signatureData,
      };
    }
  } else {
    return {
      success: false,
      error: true,
      message: "Something went wrong: \n " + removeCoupon.message,
    };
  }
};
