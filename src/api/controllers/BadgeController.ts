import { Request, Response } from "express";
import ILayerClaimModel from "../interfaces/ILayerClaimModel";
import { IResponseMessage } from "../interfaces/IResponseMessage";
import IUploadModel from "../interfaces/IUploadModel";
import IBadgeRegisterModel from "../interfaces/Schemas/IBadgeRegisterModel";
import {
  findBadgesForAccount,
  uploadMultipleBadges,
  uploadSingleBadge,
} from "../services/BadgeService";
import generateSignature from "../services/util/SignatureGenerationService";
import {
  verifyMessage,
  verifyMessageForBadge,
  verifyMessageForLayer,
} from "../services/util/SignatureVerificationService";

export const getBadges = async (req: Request, res: Response) => {
  try {
    const address: string = req.params.address;
    const resData: IResponseMessage = await findBadgesForAccount(address);
    if (resData.success) {
      res.status(200).send(resData);
      return;
    }
    res.status(500).send(resData);
    return;
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

export const uploadBadges = async (req: Request, res: Response) => {
  try {
    const uploadModel: IUploadModel = req.body;
    const badges: IBadgeRegisterModel[] = uploadModel.data;

    const isWhitelisted = await verifyMessage(
      uploadModel.saltHash,
      uploadModel.signature
    );

    if (isWhitelisted) {
      const resData: IResponseMessage = await uploadMultipleBadges(badges);
      if (resData.success) {
        res.status(200).send(resData);
        return;
      }
      res.status(500).send(resData);
    }
    res.status(401).send({
      success: false,
      error: true,
      message: "Account not whitelisted",
    });
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

export const uploadBadge = async (req: Request, res: Response) => {
  try {
    const uploadModel: IUploadModel = req.body;
    const badge: IBadgeRegisterModel = uploadModel.data;

    const isWhitelisted = await verifyMessage(
      uploadModel.saltHash,
      uploadModel.signature
    );

    if (isWhitelisted) {
      const resData: IResponseMessage = await uploadSingleBadge(badge);
      if (resData.success) {
        res.status(200).send(resData);
        return;
      }
      res.status(500).send(resData);
    }
    res.status(401).send({
      success: false,
      error: true,
      message: "Account not whitelisted",
    });
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

export const retrieveSignature = async (req: Request, res: Response) => {
  try {
    const signatureData: ILayerClaimModel = req.body;
    const badgeModel: IBadgeRegisterModel = await verifyMessageForBadge(
      signatureData.saltHash,
      signatureData.signature,
      signatureData.tokenId
    );

    if (badgeModel) {
      const resData: ILayerClaimModel = await generateSignature(
        badgeModel.address,
        badgeModel.type,
        process.env.CONTRACT_BADGES_NFT_ADDRESS
      );

      if (resData) {
        return res.status(200).send({
          success: true,
          message: "Successfully retrieved signature",
          data: resData,
        });
      }
    }

    return res.status(401).send({
      success: false,
      error: true,
      message: "Error generating siganture!",
    });
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};
