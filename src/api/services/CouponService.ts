import { IResponseMessage } from "../interfaces/IResponseMessage";
import ICouponModel from "../interfaces/Schemas/ICouponModel";
import {
  createCoupon,
  findAndAddCoupon,
  findExistingCoupon,
} from "../repositories/CouponRepo";

export const uploadSingle = async (
  coupon: ICouponModel
): Promise<IResponseMessage> => {
  try {
    const alreadyExists = await findExistingCoupon(coupon.address);
    if (alreadyExists) {
      const res = await findAndAddCoupon(coupon.address);

      return {
        success: true,
        message: "Coupon added successfully",
        data: res,
      };
    }
    const resCreate = await createCoupon(coupon);
    return {
      success: true,
      message: "Coupon created successfully",
      data: resCreate,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: true,
      message: "Coupon creation/addition failed: \n " + e,
    };
  }
};

export const getCouponsForAddress = async (
  address: string
): Promise<IResponseMessage> => {
  try {
    const res: ICouponModel = await findExistingCoupon(address);

    return {
      success: true,
      message: "Coupon found successfully",
      data: res,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: true,
      message: "Achievement creation failed: \n " + e,
    };
  }
};
