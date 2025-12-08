import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";
export const newCoupon = TryCatch(async (req, res, next) => {
    const { coupon, amount, code, discount, expiryDate, usageLimit } = req.body;
    if (!coupon || !amount || !code || !discount || !expiryDate || !usageLimit) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }
    const existing = await Coupon.findOne({ code });
    if (existing)
        return next(new ErrorHandler("Coupon already exists", 409));
    await Coupon.create({
        coupon,
        amount,
        code,
        discount,
        expiryDate,
        usageLimit,
    });
    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} created successfully`,
    });
});
