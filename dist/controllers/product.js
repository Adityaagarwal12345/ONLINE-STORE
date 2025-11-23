import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/products.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("please add photo", 400));
    if (!name || !price || !stock || !category)
        rm(photo.path, () => {
            console.log("Deleted");
        });
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(), // 👈 FINAL CORRECT SPELLING
        photo: photo?.path,
    });
    return res.status(201).json({
        success: true,
        message: "Product created Successfully",
    });
});
export const getlatestProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({})
        .sort({ createdAt: -1 })
        .limit(5);
    return res.status(200).json({
        success: true,
        products, // 👈 yeh bhejna zaroori hai bro
    });
});
export const getallcategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");
    return res.status(200).json({
        success: true,
        categories // 👈 yeh bhejna zaroori hai bro
    });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({});
    return res.status(200).json({
        success: true,
        products, // 👈 yeh bhejna zaroori hai bro
    });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));
    return res.status(200).json({
        success: true,
        product,
    });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    // 1) Check if product exists
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Invalid product ID", 400));
    // 2) If new photo uploaded -> delete old & save new path
    if (photo) {
        rm(product.photo, () => console.log("Old photo deleted"));
        product.photo = photo.path;
    }
    // 3) Update fields conditionally
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category.toLowerCase();
    // 4) Save changes
    await product.save();
    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
    });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));
    rm(product.photo, () => console.log("Old photo deleted"));
    await Product.deleteOne();
    return res.status(200).json({
        success: true,
        message: "product deleted successfully",
    });
});
