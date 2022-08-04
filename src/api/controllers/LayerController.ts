import { Request, Response } from "express";
import { IResponseMessage } from "../interfaces/IResponseMessage";
import ILayerClaimModel from "../interfaces/ILayerClaimModel";
import { getSignature } from "../services/LayerService";
import { verifyMessageForLayer } from "../services/util/SignatureVerificationService";
import ICouponModel from "../interfaces/Schemas/ICouponModel";

export const retrieveSignature = async (req: Request, res: Response) => {
  try {
    const signatureData: ILayerClaimModel = req.body;
    const couponModel: ICouponModel = await verifyMessageForLayer(
      signatureData.saltHash,
      signatureData.signature
    );

    if (couponModel.amount > 0) {
      const resData: IResponseMessage = await getSignature(
        couponModel.address,
        signatureData.tokenId
      );
      if (resData.success) {
        return res.status(200).send(resData);
      }
    }

    return res.status(401).send({
      success: false,
      error: true,
      message: "No coupons left!",
    });
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};
