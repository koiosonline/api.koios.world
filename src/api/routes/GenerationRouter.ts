import express from "express";
import * as generationController from "../controllers/GenerationController";
export const generationRouter = express.Router({ caseSensitive: false });

generationRouter.route("/generate").post(generationController.generate);
