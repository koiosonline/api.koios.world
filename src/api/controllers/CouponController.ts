import { Request, Response } from "express";
import { IResponseMessage } from "../interfaces/IResponseMessage";
import ICouponModel from "../interfaces/Schemas/ICouponModel";
import { uploadSingle } from "../services/CouponService";

export const createSingle = async (req: Request, res: Response) => {
  try {
    const data: ICouponModel = req.body;
    const resData: IResponseMessage = await uploadSingle(data);
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
