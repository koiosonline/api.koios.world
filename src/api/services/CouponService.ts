import { IResponseMessage } from "../interfaces/IResponseMessage";
import IUploadModel from "../interfaces/IUploadModel";
import ICouponModel from "../interfaces/Schemas/ICouponModel";
import {
  createCoupon,
  findAndAddCoupon,
  findAndReplaceCoupon,
  findExistingCoupon,
} from "../repositories/CouponRepo";

export const uploadSingle = async (
  uploadModel: IUploadModel
): Promise<IResponseMessage> => {
  try {
    const alreadyExists = await findExistingCoupon(uploadModel.data.address);
    if (alreadyExists) {
      const res = await findAndAddCoupon(uploadModel.data.address);

      return {
        success: true,
        message: "Coupon added successfully",
        data: res,
      };
    }
    const resCreate = await createCoupon(uploadModel.data);
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

export const uploadMultiple = async (
  coupons: ICouponModel[]
): Promise<IResponseMessage> => {
  try {
    let resData: ICouponModel[] = [];
    console.log(coupons);

    for (const coupon of coupons) {
      const alreadyExists = await findExistingCoupon(coupon.address);
      if (!alreadyExists) {
        const resCreate = await createCoupon(coupon);
        resData.push(resCreate);
      } else {
        const newCouponAmount = alreadyExists.amount + coupon.amount;
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
