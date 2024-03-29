import { IResponseMessage } from "../interfaces/IResponseMessage";
import ICouponModel from "../interfaces/Schemas/ICouponModel";
import {
  createCoupon,
  createOrAddCoupon,
  findAndRemoveCoupon,
  findAndReplaceCoupon,
  findExistingCoupon,
} from "../repositories/CouponRepo";

export const uploadSingle = async (
  coupon: ICouponModel
): Promise<IResponseMessage> => {
  try {
    const response = await createOrAddCoupon(coupon.address);
    return {
      success: true,
      message: "Coupon created successfully",
      data: response,
    };
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "Coupon creation/addition failed: \n " + e,
    };
  }
};

export const uploadMultiple = async (
  coupons: ICouponModel[]
): Promise<IResponseMessage> => {
  try {
    let resData: ICouponModel[] = [];

    for (const coupon of coupons) {
      const alreadyExists = await findExistingCoupon(coupon.address);
      if (!alreadyExists) {
        const resCreate = await createCoupon(coupon);
        resData.push(resCreate);
      } else {
        const newCouponAmount: number = +alreadyExists.amount + +coupon.amount;
        const newCoupon: ICouponModel = {
          address: coupon.address,
          amount: newCouponAmount,
        };
        const resAdd = await findAndReplaceCoupon(newCoupon);
        resData.push(resAdd);
      }
    }
    return {
      success: true,
      message: "Coupons added successfully",
      data: resData,
    };
  } catch (e) {
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
    return {
      success: false,
      error: true,
      message: "Achievement creation failed: \n " + e,
    };
  }
};

export const removeCouponForAddress = async (
  address: string
): Promise<IResponseMessage> => {
  try {
    const res = await findAndRemoveCoupon(address);

    return {
      success: true,
      message: "Coupon removed successfully",
      data: res,
    };
  } catch (e) {
    return {
      success: false,
      error: true,
      message: "Coupon removal failed: \n " + e,
    };
  }
};
