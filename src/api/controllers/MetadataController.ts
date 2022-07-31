import { Request, Response } from "express";
import IERC721MetadataModel from "../interfaces/Schemas/IERC721MetadataModel";
import { findMetadata } from "../repositories/DynamicNFTRepo";

export const retrieveMetadata = async (req: Request, res: Response) => {
  try {
    const token: string = req.params.token;
    const resData: IERC721MetadataModel = await findMetadata(parseInt(token));

    if (resData) {
      res.status(200).send(resData);
      return;
    } else {
      res.status(500).send("Non-Existent Metadata");
    }
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};
