import { NextFunction, Request, Response } from "express";
import store from "store";

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
  const callData = store.get("discordLevels");
  if (callData) {
    let foundUsername;
    callData.map((element) => {
      const result = element.filter(
        (callDataFilter) =>
          callDataFilter.username.toLowerCase() ===
          req.params.username.toLowerCase()
      );
      if (result.length >= 1) {
        foundUsername = result;
      }
    });
    return res.send(foundUsername);
  }
};
