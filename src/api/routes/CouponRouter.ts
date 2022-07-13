import express from "express";
import * as CouponController from "../controllers/CouponController";
export const couponRouter = express.Router();

couponRouter.route("/uploadSingle").post(CouponController.createSingle);
couponRouter.route("/uploadMultiple").post(CouponController.createMultiple);
couponRouter.route("/getCoupons/:address").get(CouponController.getCoupons);
