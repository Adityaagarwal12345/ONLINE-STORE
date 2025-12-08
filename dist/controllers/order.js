import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import { myCache } from "../app.js";
import ErrorHandler from "../utils/utility-class.js";
// CREATE ORDER
export const newOrder = TryCatch(async (req, res, next) => {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total, } = req.body;
    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !shippingCharges || !discount || !total)
        return next(new ErrorHandler("Please enter all fields", 400));
    await Order.create({
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
    });
    await reduceStock(orderItems);
    await invalidateCache({ product: true, order: true, admin: true });
    return res.status(201).json({
        success: true,
        message: "Order Placed Successfully",
    });
});
// GET LOGGED IN USER ORDERS
export const myOrders = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandler("User ID is required", 400));
    const key = `my-orders-${id}`;
    let orders = [];
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key));
    }
    else {
        orders = await Order.find({ user: id });
        myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
});
// GET ALL ORDERS (Admin)
//populate basically helps to fetch related data from another collection based on the reference
export const allOrders = TryCatch(async (req, res, next) => {
    const key = "all-orders";
    let orders = [];
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key));
    }
    else {
        orders = await Order.find().populate("user", "name email");
        myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
});
export const getSingleOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const key = `single-order-${id}`;
    let order;
    if (myCache.has(key)) {
        order = JSON.parse(myCache.get(key));
    }
    else {
        order = await Order.findById(id).populate("user", "name email");
        myCache.set(key, JSON.stringify(order));
    }
    if (!order)
        return next(new ErrorHandler("Order not found", 404));
    return res.status(200).json({
        success: true,
        order,
    });
});
export const processOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
        return next(new ErrorHandler("Order not found", 404));
    if (order.status === "Delivered") {
        return next(new ErrorHandler("Order is already delivered", 400));
    }
    if (order.status === "Processing")
        order.status = "Shipped";
    else if (order.status === "Shipped")
        order.status = "Delivered";
    await order.save();
    await invalidateCache({
        product: true,
        order: true,
        admin: true,
    });
    return res.status(200).json({
        success: true,
        message: `Order status updated: ${order.status}`
    });
});
export const deleteOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order)
        return next(new ErrorHandler("Order not found", 404));
    await invalidateCache({
        product: true,
        order: true,
        admin: true,
    });
    return res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    });
});
