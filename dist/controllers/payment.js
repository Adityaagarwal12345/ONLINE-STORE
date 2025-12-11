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
export const applyDiscount = TryCatch(async (req, res, next) => {
    const { code } = req.body;
    if (!code) {
        return next(new ErrorHandler("Please provide coupon code", 400));
    }
    const discount = await Coupon.findOne({ code });
    if (!discount) {
        return next(new ErrorHandler("Invalid coupon code", 404));
    }
    const currentDate = new Date();
    if (discount.expiryDate < currentDate) {
        return next(new ErrorHandler("Coupon has expired", 400));
    }
    if (discount.usedBy.length >= discount.usageLimit) {
        return next(new ErrorHandler("Coupon usage limit reached", 400));
    }
    return res.status(200).json({
        success: true,
        discount: discount.discount,
        message: `Coupon ${discount.coupon} applied successfully`,
    });
});
export const allCoupons = TryCatch(async (req, res, next) => {
    const coupons = await Coupon.find({});
    return res.status(200).json({
        success: true,
        coupons,
    });
});
export const getCoupon = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon)
        return next(new ErrorHandler("Invalid Coupon ID", 400));
    return res.status(200).json({
        success: true,
        coupon,
    });
});
export const updateCoupon = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { code, amount } = req.body;
    const coupon = await Coupon.findById(id);
    if (!coupon)
        return next(new ErrorHandler("Invalid Coupon ID", 400));
    if (code)
        coupon.code = code;
    if (amount)
        coupon.amount = amount;
    await coupon.save();
    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon.code} Updated Successfully`,
    });
});
export const deleteCoupon = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon)
        return next(new ErrorHandler("Invalid Coupon ID", 400));
    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon.code} Deleted Successfully`,
    });
});
//400 bad request
//404 not found
//409 conflict
//402 payment required
//500 internal server error
//403 forbidden
