import { Request, Response } from "express";
import IAchievementModel from "../interfaces/Schemas/IAchievementModel";
import {
  checkExistingAchievementForAccount,
  checkWhitelisted,
  getAllAchievementTypes,
  uploadMultiple,
  uploadSingle,
} from "../services/AchievementService";

export const createSingle = async (req: Request, res: Response) => {
  try {
    const data: IAchievementModel = req.body.achievementData;
    console.log(data);
    if (data.address && data.name && data.tokenId && data.type) {
      const resData = await uploadSingle(data);
      if (resData.success) {
        res.status(200).send(resData);
        return;
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Bad Request");
  }
};
//TODO Create bulk upload on server
export const createMultiple = async (req: Request, res: Response) => {
  try {
    const data: IAchievementModel[] = req.body;
    if (data.length > 1) {
      const resData = await uploadMultiple(data);
      if (resData) {
        res.status(200).send(resData);
        return;
      }
    }
    res.status(400).send("You should send via single upload!");
  } catch (err) {
    console.log(err);
    res.status(400).send("Bad Request");
  }
};

export const getAllAchievements = async (req: Request, res: Response) => {
  try {
    const resData = await getAllAchievementTypes();
    res.status(200).send(resData);
    return;
  } catch (err) {
    console.log(err);
    res.status(400).send("Bad Request");
  }
};

export const checkWhitelistedAccount = async (req: Request, res: Response) => {
  try {
    const address: string = req.params.address;
    const resData = await checkWhitelisted(address);
    res.status(200).send(resData);
    return;
  } catch (err) {
    console.log(err);
    res.status(400).send("Bad Request");
  }
};

export const checkExistingAchievement = async (req: Request, res: Response) => {
  try {
    const address = req.query.address;
    const type = req.query.type;
    const name = req.query.name;
    const tokenId = req.query.tokenId;
    const resData = await checkExistingAchievementForAccount(
      address,
      type,
      name,
      tokenId
    );
    res.status(200).send(resData);
    return;
  } catch (err) {
    console.log(err);
    res.status(400).send("Bad Request");
  }
};
