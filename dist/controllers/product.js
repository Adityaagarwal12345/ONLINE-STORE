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
