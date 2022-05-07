import { NextFunction, Request, Response } from "express";
import store from "store";
import { fetchUserInfo } from "../services/DiscordService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  const callData = store.get("discordLevels");
  if (callData) {
    res.send(callData);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const callData = await fetchUserInfo(req.params.username);
  if (callData) {
    return res.send(callData);
  }
};
