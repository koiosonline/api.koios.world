import { Request, Response } from "express";
import IERC1155MetadataModel from "../interfaces/Schemas/IERC1155MetadataModel";
import IERC721MetadataModel from "../interfaces/Schemas/IERC721MetadataModel";
import { findMetadata } from "../repositories/DynamicNFTRepo";
import { findMetadataERC1155, findAll } from "../repositories/LayerRepo";

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

export const retrieveMetadataERC1155 = async (req: Request, res: Response) => {
  try {
    const token: string = req.params.token;
    const resData: IERC1155MetadataModel = await findMetadataERC1155(
      parseInt(token)
    );

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

export const retrieveAllTokens = async (req: Request, res: Response) => {
  try {
    const resData: IERC1155MetadataModel[] = await findAll();
    if (resData) {
      res.status(200).send(resData);
      return;
    } else {
      res.status(500).send("Non-Existent Metadata");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Bad Request");
  }
};
