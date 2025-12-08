import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/products.js";
import { invalidateCache } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
// 📌 GET LATEST 5 PRODUCTS
export const getlatestProducts = TryCatch(async (req, res, next) => {
    let products = [];
    if (myCache.has("latest-products")) {
        products = JSON.parse(myCache.get("latest-products"));
    }
    else {
        products = await Product.find({})
            .sort({ createdAt: -1 })
            .limit(5);
        myCache.set("latest-products", JSON.stringify(products));
    }
    return res.status(200).json({ success: true, products });
});
// 📌 GET ALL CATEGORIES
export const getallcategories = TryCatch(async (req, res, next) => {
    let categories = [];
    if (myCache.has("categories")) {
        categories = JSON.parse(myCache.get("categories"));
    }
    else {
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories));
    }
    return res.status(200).json({ success: true, categories });
});
// 📌 GET ALL PRODUCTS FOR ADMIN
export const getAdminProducts = TryCatch(async (req, res, next) => {
    let products = [];
    if (myCache.has("admin-products")) {
        products = JSON.parse(myCache.get("admin-products"));
    }
    else {
        products = await Product.find({});
        myCache.set("admin-products", JSON.stringify(products));
    }
    return res.status(200).json({ success: true, products });
});
// 📌 GET SINGLE PRODUCT
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    let product;
    if (myCache.has(`product-${id}`)) {
        product = JSON.parse(myCache.get(`product-${id}`));
    }
    else {
        product = await Product.findById(id);
        if (!product)
            return next(new ErrorHandler("Product not found", 404));
        myCache.set(`product-${id}`, JSON.stringify(product));
    }
    return res.status(200).json({ success: true, product });
});
// 📌 CREATE NEW PRODUCT
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please add photo", 400));
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => console.log("Deleted"));
        return next(new ErrorHandler("Please enter all fields", 400));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    await invalidateCache({ product: true });
    return res.status(201).json({
        success: true,
        message: "Product created successfully",
    });
});
// 📌 UPDATE PRODUCT
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Invalid product ID", 400));
    if (photo) {
        rm(product.photo, () => console.log("Old photo deleted"));
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category.toLowerCase();
    await product.save();
    await invalidateCache({ product: true });
    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
    });
});
// 📌 DELETE PRODUCT
export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));
    rm(product.photo, () => console.log("Old photo deleted"));
    await product.deleteOne();
    await invalidateCache({ product: true });
    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});
// 📌 SEARCH + FILTER PRODUCTS
export const searchProduct = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search) {
        baseQuery.name = {
            $regex: String(search),
            $options: "i",
        };
    }
    if (category) {
        baseQuery.category = String(category).toLowerCase();
    }
    if (price) {
        baseQuery.price = { $lte: Number(price) };
    }
    const [products, filteredProducts] = await Promise.all([
        Product.find(baseQuery)
            .sort(sort ? { price: sort === "asc" ? 1 : -1 } : undefined)
            .limit(limit)
            .skip(skip),
        Product.find(baseQuery),
    ]);
    const totalPage = Math.ceil(filteredProducts.length / limit);
    return res.status(200).json({
        success: true,
        products,
        totalPage,
        currentPage: page,
    });
});
