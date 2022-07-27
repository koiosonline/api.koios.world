import { Request, Response } from "express";
import { IResponseMessage } from "../interfaces/IResponseMessage";

import { findAddress } from "../services/WhitelistService";

export const getWhitelistedAddress = async (req: Request, res: Response) => {
  try {
    const data: string = req.params.address;
    const resData: IResponseMessage = await findAddress(data);
    if (resData.success) {
      res.status(200).send(resData);
      return;
    }
    res.status(500).send(resData);
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};
