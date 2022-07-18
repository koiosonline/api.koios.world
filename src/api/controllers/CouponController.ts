import { ethers } from "ethers";
import { Request, Response } from "express";
import { IResponseMessage } from "../interfaces/IResponseMessage";
import ICouponModel from "../interfaces/Schemas/ICouponModel";
import {
  getCouponsForAddress,
  uploadMultiple,
  uploadSingle,
} from "../services/CouponService";
import IUploadModel from "../interfaces/IUploadModel";
import { verifyMessage } from "../services/util/SignatureVerificationService";

export const createSingle = async (req: Request, res: Response) => {
  try {
    const uploadModel: IUploadModel = req.body;
    const coupon = uploadModel.data;
    const isWhitelisted = await verifyMessage(
      uploadModel.saltHash,
      uploadModel.signature
    );

    if (isWhitelisted) {
      const resData: IResponseMessage = await uploadSingle(coupon);
      res.status(200).json(resData);
      return;
    }
    return res.status(401).send({
      success: false,
      error: true,
      message: "Account not whitelisted",
    });
  } catch (err) {
    console.error(err);
    res.status(400).send("Bad Request");
  }
};

export const createMultiple = async (req: Request, res: Response) => {
  try {
    const uploadModel: IUploadModel = req.body;
    const coupons: ICouponModel[] = uploadModel.data;
    const isWhitelisted = await verifyMessage(
      uploadModel.saltHash,
      uploadModel.signature
    );

    if (isWhitelisted) {
      const resData: IResponseMessage = await uploadMultiple(coupons);
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
    res.status(400).send("Bad Request");
  }
};
