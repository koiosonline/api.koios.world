import { Request, Response } from "express";
import { IResponseMessage } from "../interfaces/IResponseMessage";
import IERC721MetadataModel from "../interfaces/Schemas/IERC721MetadataModel";
import { createNewMetaDoc } from "../repositories/DynamicNFTRepo";

export const createNewMetadata = async (req: Request, res: Response) => {
  try {
    const data: IERC721MetadataModel = req.body;
    const resData: IERC721MetadataModel = await createNewMetaDoc(data);

    // if (resData.success) {
    //   res.status(200).send(resData);
    //   return;
    // }
    res.status(200).send(resData);
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};
