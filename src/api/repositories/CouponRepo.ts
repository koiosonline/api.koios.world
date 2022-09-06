import Coupons from "../db/Coupons";
import ICouponModel from "../interfaces/Schemas/ICouponModel";

export const createCoupon = async (
  couponModel: ICouponModel
): Promise<ICouponModel> => {
  return Coupons.create(couponModel);
};

export const createOrAddCoupon = async (
  address: string
): Promise<ICouponModel> => {
  const existingCoupon = await findExistingCoupon(address);
  if (!existingCoupon) {
    const newCoupon: ICouponModel = {
      address: address,
      amount: 1,
    };
    return createCoupon(newCoupon);
  } else {
    const newCouponAmount = existingCoupon.amount + 1;
    const newCoupon: ICouponModel = {
      address: address,
      amount: newCouponAmount,
    };
    return findAndReplaceCoupon(newCoupon);
  }
};

export const findAndRemoveCoupon = async (
  address: string
): Promise<ICouponModel> => {
  const existingCoupon = await findExistingCoupon(address);
  if (existingCoupon && existingCoupon.amount > 0) {
    const newCouponAmount = existingCoupon.amount - 1;
    const newCoupon: ICouponModel = {
      address: address,
      amount: newCouponAmount,
    };

    return findAndReplaceCoupon(newCoupon);
  }

  if (existingCoupon && existingCoupon.amount === 0) {
    return Coupons.findOneAndDelete(existingCoupon);
  }
};

export const findAndReplaceCoupon = async (
  coupon: ICouponModel
): Promise<ICouponModel> => {
  return Coupons.findOneAndReplace(
    {
      address: coupon.address,
    },
    coupon
  );
};

export const findExistingCoupon = async (
  address: string
): Promise<ICouponModel> => {
  return Coupons.findOne({
    address: address,
  });
};
