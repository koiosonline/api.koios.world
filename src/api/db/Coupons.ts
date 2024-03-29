import { Schema, model, models } from "mongoose";
import ICouponModel from "../interfaces/Schemas/ICouponModel";

const couponSchema = new Schema<ICouponModel>({
  address: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
});

const Coupons = model("coupons", couponSchema);

export default Coupons;
