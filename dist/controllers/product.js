import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/products.js";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
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
