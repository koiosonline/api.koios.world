import { NextFunction, Request, Response } from "express";

import axios from "axios";
import executeClaim from "./executeClaim";

export const post = async (req: Request, res: Response, next: NextFunction) => {
  const googleRes = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${req.body.captchaToken}`
  );
  const data = googleRes.data;
  res.send(await executeClaim(req.body.claimerAddress, data));
};
