import Coupons from "../db/Coupons";
import ICouponModel from "../interfaces/Schemas/ICouponModel";

export const createCoupon = async (
  couponModel: ICouponModel
): Promise<ICouponModel> => {
  return Coupons.create(couponModel);
};

export const findAndAddCoupon = async (
  address: string
): Promise<ICouponModel> => {
  await Coupons.findOneAndUpdate({
    address: address,
    $inc: { amount: 1 },
  });
  return Coupons.findOne({
    address: address,
  });
};

export const findExistingCoupon = async (
  address: string
): Promise<ICouponModel> => {
  return Coupons.findOne({
    address: address,
  });
};
