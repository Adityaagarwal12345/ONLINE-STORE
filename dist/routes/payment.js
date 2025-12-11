import express from "express";
import { newCoupon, applyDiscount, allCoupons, getCoupon, updateCoupon, deleteCoupon } from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";
const router = express.Router();
// Public (or admin-only if you want)
router.post("/coupon/new", newCoupon);
// Apply discount
router.post("/discount", applyDiscount);
// Admin-only coupon management
router.get("/coupon/all", adminOnly, allCoupons);
router
    .route("/coupon/:id")
    .get(adminOnly, getCoupon)
    .put(adminOnly, updateCoupon)
    .delete(adminOnly, deleteCoupon);
export default router;
