import express from "express";
import * as CouponController from "../controllers/CouponController";
export const couponRouter = express.Router();

couponRouter.route("/uploadSingle").post(CouponController.createSingle);
