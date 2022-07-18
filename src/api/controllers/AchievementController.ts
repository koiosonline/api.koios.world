import { Request, Response } from "express";
import { IResponseMessage } from "../interfaces/IResponseMessage";
import IAchievementModel from "../interfaces/Schemas/IAchievementModel";
import {
  checkExistingAchievementForAccount,
  getAllAchievementTypes,
  uploadMultiple,
  uploadSingle,
} from "../services/AchievementService";

export const createSingle = async (req: Request, res: Response) => {
  try {
    const data: IAchievementModel = req.body;
    const resData: IResponseMessage = await uploadSingle(data);
    if (resData.success) {
      res.status(200).send(resData);
      return;
    }
    res.status(500).send(resData);
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

//TODO Create bulk upload on server
export const createMultiple = async (req: Request, res: Response) => {
  try {
    const data: IAchievementModel[] = req.body;
    if (data.length > 1) {
      const resData: IResponseMessage = await uploadMultiple(data);
      if (resData.success) {
        res.status(200).send(resData);
        return;
      }
      res.status(500).send(resData);
    }
    res.status(400).send("You should send via single upload!");
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};

export const getAllAchievements = async (req: Request, res: Response) => {
  try {
    const resData: IResponseMessage = await getAllAchievementTypes();
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

export const checkExistingAchievement = async (
  req: Request<{}, {}, {}, IAchievementModel>,
  res: Response
) => {
  try {
    const { address, type, name, tokenId } = req.query;
    const resData: IResponseMessage = await checkExistingAchievementForAccount(
      address,
      type,
      name,
      tokenId
    );
    res.status(200).send(resData);
    return;
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};
