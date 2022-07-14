import { ethers } from "ethers";
import { Request, Response } from "express";
import { IResponseMessage } from "../interfaces/IResponseMessage";
import ICouponModel from "../interfaces/Schemas/ICouponModel";
import {
  getCouponsForAddress,
  uploadMultiple,
  uploadSingle,
} from "../services/CouponService";
import { checkWhitelisted } from "../services/AchievementService";
import IUploadModel from "../interfaces/IUploadModel";
import { verifyMessage } from "../services/util/SignatureVerificationService";

export const createSingle = async (req: Request, res: Response) => {
  try {
    const uploadModel: IUploadModel = req.body;
    const isWhitelisted = await verifyMessage(
      uploadModel.saltHash,
      uploadModel.signature
    );

    if (isWhitelisted) {
      const resData: IResponseMessage = await uploadSingle(uploadModel);
      res.status(200).json(resData);
      return;
    }
    return res.status(401).send({
      success: false,
      error: true,
      message: "Account not whitelisted",
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Bad Request");
  }
};

export const createMultiple = async (req: Request, res: Response) => {
  try {
    const coupons: ICouponModel[] = req.body.coupons;
    const saltHash = req.body.saltHash;
    const signature = req.body.signature;
    const address = ethers.utils.verifyMessage(saltHash, signature);
    const whitelistData = await checkWhitelisted(address);
    if (whitelistData.success) {
      const resData: IResponseMessage = await uploadMultiple(coupons);
      if (resData.success) {
        res.status(200).send(resData);
        return;
      }
      res.status(500).send(resData);
    }
    res.status(401).send(whitelistData);
  } catch (err) {
    console.log(err);
    res.status(400).send("Bad Request");
  }
};

export const getCoupons = async (req: Request, res: Response) => {
  try {
    const address: string = req.params.address;
    const resData: IResponseMessage = await getCouponsForAddress(address);
    if (resData.success) {
      res.status(200).send(resData);
      return;
    }
    res.status(500).send(resData);
  } catch (err) {
    console.log(err);
    res.status(400).send("Bad Request");
  }
};
