import express from "express";
import * as generationController from "../controllers/GenerationController";
export const generationRouter = express.Router();

generationRouter.route("/generate").post(generationController.generate);
