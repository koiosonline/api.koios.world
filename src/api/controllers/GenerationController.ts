import { Request, Response } from "express";
import { checkPassword, generateJson } from "../services/GenerationService";

export const generate = async (req: Request, res: Response) => {
  try {
    if (checkPassword(req.body.password)) {
      const resp = await generateJson();
      if (resp.success) {
        res.status(200).send(resp);
        return;
      }
      res.status(400).send("Bad Request");
      return;
    }
    res.status(404).send("Not Authorized");
    return;
  } catch (err) {
    res.status(400).send("Bad Request");
  }
};
