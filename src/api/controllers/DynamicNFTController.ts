import { Request, Response } from "express";
import { IResponseMessage } from "../interfaces/IResponseMessage";
import IERC721ClaimModel from "../interfaces/Schemas/IERC721ClaimModel";
import {
  evolveNFT,
  findWhitelistedAddress,
  getSignatureForAddress,
  uploadMultiple,
  uploadSingle,
} from "../services/DynamicNFTService";
import IUploadModel from "../interfaces/IUploadModel";
import {
  verifyMessage,
  verifyMessageForOwnedLayers,
} from "../services/util/SignatureVerificationService";
import IEvolveModel from "../interfaces/IEvolveModel";

// TODO - add authorization via signature. This is a future feature.
// export const createNewMetadata = async (req: Request, res: Response) => {
//   try {
//     const data: IERC721MetadataModel = req.body;
//     const resData: IERC721MetadataModel = await createNewMetaDoc(data);

//     // if (resData.success) {
//     //   res.status(200).send(resData);
//     //   return;
//     // }
//     res.status(200).send(resData);
//   } catch (err) {
//     res.status(400).send("Bad Request");
//   }
// };

export const whitelistSingle = async (req: Request, res: Response) => {
  try {
    const uploadModel: IUploadModel = req.body;
    const model: IERC721ClaimModel = uploadModel.data;
    const isWhitelisted = await verifyMessage(
      uploadModel.saltHash,
      uploadModel.signature
    );

    if (isWhitelisted) {
      const resData: IResponseMessage = await uploadSingle(model);
      res.status(200).json(resData);
      return;
    }
    return res.status(401).send({
      success: false,
      error: true,
      message: "Account not whitelisted",
    });
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

export const whitelistMultiple = async (req: Request, res: Response) => {
  try {
    const uploadModel: IUploadModel = req.body;
    const models: IERC721ClaimModel[] = uploadModel.data;
    const isWhitelisted = await verifyMessage(
      uploadModel.saltHash,
      uploadModel.signature
    );

    if (isWhitelisted) {
      const resData: IResponseMessage = await uploadMultiple(models);
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

export const getWhitelistedDynamicAddress = async (
  req: Request,
  res: Response
) => {
  try {
    const data: string = req.params.address;
    const resData: IResponseMessage = await findWhitelistedAddress(data);
    if (resData.success) {
      res.status(200).send(resData);
      return;
    }
    res.status(500).send(resData);
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

export const getSignature = async (req: Request, res: Response) => {
  try {
    const data: string = req.params.address;
    const resData: IResponseMessage = await getSignatureForAddress(data);
    if (resData.success) {
      res.status(200).send(resData);
      return;
    }
    res.status(500).send(resData);
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

export const createImage = async (req: Request, res: Response) => {
  try {
    const model: IEvolveModel = req.body;

    const isVerified = await verifyMessageForOwnedLayers(
      model.saltHash,
      model.signature,
      model.tokens
    );

    if (isVerified) {
      const resData = await evolveNFT(model, model.saltHash, model.signature);
      if (resData.success) {
        res.status(200).send(resData);
        return;
      }
      res.status(500).send(resData);
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
